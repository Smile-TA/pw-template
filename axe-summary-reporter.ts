import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
} from "@playwright/test/reporter";

import { type Result as ViolationResult, NodeResult } from "axe-core";

interface Violation extends ViolationResult {
  url: string;
}

interface violationNode extends NodeResult {
  url: string;
  description: string;
  help: string;
  helpUrl: string;
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
    const nodes = violationsDecoded.reduce((acc, violation) => {
      const modifiedNodes = violation.nodes.map((n) => {
        return {
          url: violation.url,
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
      nodes,
      // TODO: Need to consider all targets not just the first one. Keep an eye if any websites throw errors below
      (violationNode) => {
        if (violationNode.target.length > 1) {
          throw Error("More than one target detected at: ");
        }
        return violationNode.target[0];
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
