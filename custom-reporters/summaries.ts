import fs from "node:fs";
import path from "path";

/**
 * Shared plumbing for the summaries/ directory that the custom reporters write to.
 *
 * Everything in summaries/ is per-RUN output: report-banner-reporter copies the dir into the
 * HTML report (published to Pages), and CI reads summaries/integrity-connect-review.txt to decide
 * who owns the Asana card. CI reuses its workspace across builds, so a file left by an earlier
 * run would be republished — and would flag pages that are now clean — unless it is cleared.
 * Each reporter therefore calls resetSummaries() from onBegin and writes via writeSummary().
 *
 * The dir itself is tracked (summaries/.gitignore ignores its own contents), so KEEP_FILES is
 * excluded from both the reset and the copy into the report.
 */

// Resolved at import time, like the reporters' own paths. Playwright runs them from the repo root.
export const SUMMARIES_DIR = path.join(process.cwd(), "summaries");

/** Tracked files that belong to the directory itself rather than to a run. */
export const KEEP_FILES = [".gitignore"];

export const isKeptFile = (name: string): boolean => KEEP_FILES.includes(name);

export const summaryPath = (file: string): string =>
  path.join(SUMMARIES_DIR, file);

/** Summary files currently on disk — i.e. produced by this run once resetSummaries() has run. */
export function summaryFiles(dir: string = SUMMARIES_DIR): string[] {
  if (!fs.existsSync(dir)) return [];
  // Files only, matching utils/reset-summaries.sh's `-type f`: a stray subdirectory would make
  // resetSummaries()'s non-recursive rmSync throw EISDIR out of every reporter's onBegin.
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && !isKeptFile(e.name))
    .map((e) => e.name);
}

let didReset = false;

/**
 * Drop summary files left by an earlier run. Runs at most once per process and no-ops when the
 * dir is absent, so every reporter can call it from onBegin regardless of registration order or
 * of which reporters are enabled — whichever starts first does the work.
 *
 * NOTE this only covers runs that reach the reporters. A CI run that dies earlier (say
 * preparePages.ts fails) never gets here, which is why utils/run-e2e-ci.sh clears the dir before
 * starting Playwright.
 */
export function resetSummaries(): void {
  if (didReset) return;
  didReset = true;
  const stale = summaryFiles();
  for (const file of stale) fs.rmSync(summaryPath(file), { force: true });
  if (stale.length > 0) {
    console.log(
      `Cleared ${stale.length} summary file(s) from a previous run: ${stale.join(", ")}`,
    );
  }
}

/**
 * Write a summary file, creating summaries/ when needed. Sync on purpose: report-banner-reporter
 * runs right after the summary reporters and copies these files into the report, so an async
 * write may not have flushed by then.
 */
export function writeSummary(file: string, contents: string): void {
  fs.mkdirSync(SUMMARIES_DIR, { recursive: true });
  fs.writeFileSync(summaryPath(file), contents);
}
