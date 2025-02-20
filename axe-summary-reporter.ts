import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
} from "@playwright/test/reporter";

import { type Result as ViolationResult } from "axe-core";
interface Violation extends ViolationResult {
  url: string;
}
class AxeSummaryReporter implements Reporter {
  private suite!: Suite;
  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
    this.suite = suite;
  }

  onEnd(result: FullResult) {
    // Can access all test results and attachments here.
    // Try to use the build pattern from the html reporter
    // https://github.com/microsoft/playwright/blob/main/packages/playwright/src/reporters/html.ts#L241
    const suites = this.suite;
    const violationsDecoded = this.getViolations(suites).flat();
    const grouped = Map.groupBy(
      violationsDecoded,
      // TODO: Need to consider all nodes and targets not just the first one. Keep an eye if any websites throw errors below
      (violation: Violation) => {
        if (violation.nodes.length > 1) {
          throw Error("More than one node detected");
        }
        if (violation.nodes.some((n) => n.target.length > 1)) {
          throw Error("More than one target detected");
        }
        return violation.nodes[0].target[0];
      }
    );
    console.log(grouped);
    console.log(`Finished the run: ${result.status}`);
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
