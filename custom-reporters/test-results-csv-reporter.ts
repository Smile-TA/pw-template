import type {
  FullConfig,
  Reporter,
  TestCase,
  TestResult,
  TestStep,
} from "@playwright/test/reporter";

import crypto from "node:crypto";
import fs from "node:fs";
import path from "path";

import { stringify } from "csv-stringify/sync";

import { resetSummaries, writeSummary } from "./summaries";

/**
 * One row per test RESULT (not per test), so retries appear as their own rows.
 * report-banner-reporter links the file from the report banner.
 */
export const TEST_RESULTS_CSV = "test-results.csv";

const COLUMNS = [
  // identity
  "project",
  "file",
  "suite",
  "pagePath",
  "pageUrl",
  "checkName",
  "title",
  // outcome + timing
  "status",
  "expectedStatus",
  "durationMs",
  "timeoutMs",
  "startTime",
  // metadata
  "tags",
  "annotations",
  // failure detail
  "errorCount",
  "failedStep",
  "failedStepCategory",
  "error",
  "errorSnippet",
  "errorStack",
  // evidence
  "attachmentCount",
  "attachments",
  "tracePath",
  "screenshotPath",
  "videoPath",
  "reportLink",
] as const;

// Playwright colorizes error text. Built via the constructor rather than a literal so the ESC
// byte doesn't sit in the source (and to sidestep eslint's no-control-regex).
const ANSI = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");

/**
 * Collapse to a single line and drop terminal colors. Every text cell goes through this, so a
 * row is always exactly one CSV line — nothing is truncated, only reflowed. Note this costs the
 * visual alignment of `errorSnippet`'s code frame; switch to real newlines if you want it back
 * (csv-stringify quotes them correctly, at the price of multi-line rows).
 */
const clean = (s: string): string =>
  s
    .replace(ANSI, "")
    .replace(/\s*\n\s*/g, " | ")
    .trim();

/**
 * The page under test is encoded in title strings, not in structured data:
 *   e2e.spec.ts   `test.describe(\`test ${pageName} page\`)`   -> suite title
 *   wcag.spec.ts  `test(\`Check WCAG on ${pageName} page\`)`   -> test title
 * pageName is the path ("/phpagents/") except for the home page, which each spec words
 * differently. Top-level e2e tests (Check Admin Email, cookie consent, …) are site-wide and
 * legitimately have no page.
 */
const SUITE_PAGE = /^test (.+) page$/;
const TITLE_PAGE = /^(.+) on (.+) page$/;
const HOME_NAMES = new Set(["Home", "Home Page"]);

const toPagePath = (pageName: string): string =>
  HOME_NAMES.has(pageName) ? "/" : pageName;

/** Deepest step carrying an error — the most specific cause, since parents propagate it up. */
function failedStep(steps: TestStep[]): TestStep | undefined {
  for (const step of steps) {
    const deeper = failedStep(step.steps);
    if (deeper) return deeper;
    if (step.error) return step;
  }
  return undefined;
}

class TestResultsCsvReporter implements Reporter {
  private rows: Record<string, string | number>[] = [];
  private rootDir = process.cwd();
  private baseUrl = "";
  private reportDataDir = path.join(process.cwd(), "playwright-report", "data");

  onBegin(config: FullConfig): void {
    this.rootDir = config.rootDir;
    this.baseUrl = (process.env.BASE_URL ?? "").replace(/\/$/, "");
    // Drop an earlier run's summaries (see custom-reporters/summaries.ts) so this run's
    // report can't link a stale one — CI reuses its workspace across builds.
    resetSummaries();
  }

  /**
   * Report-relative href for an attachment, so the link works on the published Pages site and
   * not just locally.
   *
   * The html reporter copies attachments to playwright-report/data/<sha1-of-content><ext>. That
   * naming is its internal business, so rather than trust it we VERIFY the computed file exists
   * and fall back to the repo-relative source path — if a Playwright upgrade changes the scheme
   * we degrade to a local path instead of emitting a dead link.
   *
   * MUST be called from onEnd, never onTestEnd: the html reporter writes data/ in ITS onEnd, so
   * during onTestEnd the directory is still empty and every lookup would miss and fall back.
   * Registration order in playwright.config.ts puts `html` first, so by our onEnd its files are
   * on disk (report-banner-reporter depends on the same ordering to read index.html).
   */
  private attachmentHref(file: string): string {
    if (!fs.existsSync(file)) return "";
    const ext = path.extname(file);
    const sha1 = crypto
      .createHash("sha1")
      .update(fs.readFileSync(file))
      .digest("hex");
    if (fs.existsSync(path.join(this.reportDataDir, `${sha1}${ext}`))) {
      return `data/${sha1}${ext}`;
    }
    return path.relative(process.cwd(), file);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    // titlePath() is ['', project, file, ...suites, title]; everything between the file and the
    // title is describe() nesting.
    const suite = test.titlePath().slice(3, -1).join(" > ");

    const fromSuite = SUITE_PAGE.exec(suite);
    const fromTitle = TITLE_PAGE.exec(test.title);
    const pagePath = fromSuite
      ? toPagePath(fromSuite[1])
      : fromTitle
        ? toPagePath(fromTitle[2])
        : "";
    // Strip the page out of the title so one check groups across every page it ran on.
    const checkName = fromTitle ? fromTitle[1] : test.title;

    const firstError = result.errors.find((e) => e.snippet ?? e.stack) ?? result.errors[0];
    const step = failedStep(result.steps);

    const byName = (name: string) => result.attachments.find((a) => a.name === name)?.path;
    const byType = (prefix: string) =>
      result.attachments.find((a) => a.contentType?.startsWith(prefix))?.path;
    const trace = byName("trace");
    const screenshot = byName("screenshot") ?? byType("image/");
    const video = byName("video") ?? byType("video/");

    this.rows.push({
      project: test.parent.project()?.name ?? "",
      file: path.relative(this.rootDir, test.location.file),
      suite,
      pagePath,
      pageUrl: pagePath && this.baseUrl ? `${this.baseUrl}${pagePath}` : "",
      checkName,
      title: test.title,
      status: result.status,
      // Reveals tests marked test.fail()/fixme — a "failed" row that was supposed to fail.
      expectedStatus: test.expectedStatus,
      durationMs: result.duration,
      // The budget a timedOut row blew through.
      timeoutMs: test.timeout,
      startTime: result.startTime.toISOString(),
      tags: test.tags.join(" "),
      annotations: test.annotations
        .map((a) => (a.description ? `${a.type}=${a.description}` : a.type))
        .join("; "),
      errorCount: result.errors.length,
      // Separates an assertion failure ('expect') from a navigation failure ('pw:api') from a
      // beforeAll breaking ('hook') — the same `status: failed` covers all three.
      failedStep: step ? clean(step.title) : "",
      failedStepCategory: step?.category ?? "",
      error: result.errors
        .map((e) => e.message ?? e.value ?? "")
        .filter(Boolean)
        .map(clean)
        .join(" || "),
      errorSnippet: firstError?.snippet ? clean(firstError.snippet) : "",
      errorStack: firstError?.stack ? clean(firstError.stack) : "",
      attachmentCount: result.attachments.length,
      attachments: result.attachments.map((a) => a.name).join("; "),
      // Raw source paths; rewritten to report-relative hrefs in onEnd (see attachmentHref).
      tracePath: trace ?? "",
      screenshotPath: screenshot ?? "",
      videoPath: video ?? "",
      // Relative to the report root (not the local PW server on localhost:9323) so the link
      // resolves wherever the report is hosted — same convention as axe-summary-reporter.
      reportLink: `#?testId=${test.id}`,
    });
  }

  onEnd() {
    if (this.rows.length === 0) {
      console.log("No test results to write to CSV.");
      return;
    }
    // Now that the html reporter's onEnd has run, turn the raw attachment paths into hrefs that
    // resolve inside the published report.
    for (const row of this.rows) {
      for (const key of ["tracePath", "screenshotPath", "videoPath"] as const) {
        const raw = row[key];
        row[key] = raw ? this.attachmentHref(String(raw)) : "";
      }
    }

    // onTestEnd fires in whatever order the workers finish, so sort into a stable shape —
    // two builds of the same suite then produce diffable CSVs.
    this.rows.sort(
      (a, b) =>
        String(a.file).localeCompare(String(b.file)) ||
        String(a.pagePath).localeCompare(String(b.pagePath)) ||
        String(a.suite).localeCompare(String(b.suite)) ||
        String(a.title).localeCompare(String(b.title)),
    );
    writeSummary(
      TEST_RESULTS_CSV,
      stringify(this.rows, {
        columns: COLUMNS as unknown as string[],
        header: true,
      }),
    );
    console.log(
      `The test results CSV has been saved (${this.rows.length} result row(s), ${COLUMNS.length} columns).`,
    );
  }
}

export default TestResultsCsvReporter;
