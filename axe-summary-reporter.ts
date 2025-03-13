import type {
  FullConfig,
  Reporter,
  Suite,
  TestCase,
} from "@playwright/test/reporter";

import fs from "node:fs";
import path from "path";

import { type Result as ViolationResult, NodeResult } from "axe-core";

interface Violation extends ViolationResult {
  url: string;
  testId: string;
}

interface violationNode extends NodeResult {
  url: string;
  testId: string;
  description: string;
  help: string;
  helpUrl: string;
}

class AxeSummaryReporter implements Reporter {
  private suite!: Suite;
  onBegin(config: FullConfig, suite: Suite) {
    this.suite = suite;
  }

  onEnd() {
    // Can access all test results and attachments here.
    // Try to use the build pattern from the html reporter
    // https://github.com/microsoft/playwright/blob/main/packages/playwright/src/reporters/html.ts#L241
    const suites = this.suite;
    const violationsDecoded = this.getViolations(suites).flat();
    const nodes = violationsDecoded.reduce((acc, violation) => {
      const modifiedNodes = violation.nodes.map((n) => {
        return {
          url: violation.url,
          testId: "http://localhost:9323/#?testId=" + violation.testId,
          description: violation.description,
          help: violation.help,
          helpUrl: violation.helpUrl,
          ...n,
        };
      });
      acc.push(...modifiedNodes);
      return acc;
    }, [] as violationNode[]);
    const grouped = Map.groupBy(
      nodes.map(
        ({
          url,
          testId,
          description,
          help,
          helpUrl,
          failureSummary,
          target,
          impact,
        }) => ({
          url,
          testId,
          description,
          help,
          helpUrl,
          failureSummary,
          target,
          impact,
        })
      ),
      (violationNode) => {
        return violationNode.target.join(" ");
      }
    );
    const reduced: {
      [key: string]: {
        description: string;
        help: string;
        helpUrl: string;
        impact: string | null | undefined;
        pages: { url: string; testId: string }[];
      };
    } = {};
    for (const [k, v] of grouped) {
      const { description, help, helpUrl, impact } = v[0];
      reduced[k] = { description, help, helpUrl, impact, pages: [] };
      reduced[k].pages = v.map(({ url, testId }) => ({ url, testId }));
    }
    const filePath = path.join(process.cwd(), "wcag-summary", "out.json");
    fs.writeFile(filePath, JSON.stringify(reduced), (err) => {
      if (err) throw err;
      console.log("The wcag summary file has been saved!");
    });
  }

  getViolations(suite: Suite | TestCase, res: Violation[] = []) {
    if (suite.type === "test") {
      suite.results.forEach((result) => {
        res?.push(
          ...result.attachments
            .filter((attachment) => attachment.name === "axe-results")
            .map((attachment) => {
              const body = JSON.parse(attachment.body?.toString("utf-8") ?? "");
              const url = body.url;
              const violations = body.violations;
              return violations.map((violation: Violation) => ({
                ...violation,
                url: url,
                testId: suite.id,
              }));
            })
        );
      });
    } else {
      suite.entries().forEach((s) => this.getViolations(s, res));
    }
    return res;
  }
}

export default AxeSummaryReporter;
