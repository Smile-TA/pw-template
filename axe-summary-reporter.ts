/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";

// import { type Result as ViolationResult } from "axe-core";

class AxeSummaryReporter implements Reporter {
  private suite!: Suite;
  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
    this.suite = suite;
  }

  onTestBegin(test: TestCase) {
    console.log(`Starting test ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Finished test ${test.title}: ${result.status}`);
  }

  onEnd(result: FullResult) {
    // Can access all test results and attachments here.
    // Try to use the build pattern from the html reporter
    // https://github.com/microsoft/playwright/blob/main/packages/playwright/src/reporters/html.ts#L241
    const suites = this.suite;
    const violationsDecoded = this.getViolations(suites).flat();
    const grouped = Object.groupBy(
      violationsDecoded,
      (o: { nodes: any[] }) => o.nodes[0].target
    );
    console.log(grouped);
    console.log(`Finished the run: ${result.status}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getViolations(suite: Suite | TestCase, res: any = []) {
    if (suite.type === "test") {
      suite.results.forEach((result) => {
        res?.push(
          ...result.attachments
            .filter((attachment) => attachment.name === "axe-results")
            .map((attachment) => {
              const body = JSON.parse(attachment.body?.toString("utf-8") ?? "");
              const url = body.url;
              const violations = body.violations;
              return violations.map((violation: any) => ({
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
