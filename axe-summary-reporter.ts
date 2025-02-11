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
    // const messageString = result.error?.message ?? "";
    // console.log(stripAnsi(messageString));
    if (test.title.includes("WCAG")) {
      // const violations = result.attachments.filter(
      //   (attachment) => attachment.name === "violations"
      // );
      // const s = violations[0].body?.toString("utf-8") ?? "";
      // console.log(
      //   `TEST RESULST FOR ${test.title}
      //   `,
      //   JSON.stringify(JSON.parse(s), null, "    "),
      //   `
      //   END TEST RESULST FOR ${test.title}`
      // );
    }
  }

  onEnd(result: FullResult) {
    // Can access all test results and attachments here.
    // Try to use the build pattern from the html reporter
    // https://github.com/microsoft/playwright/blob/main/packages/playwright/src/reporters/html.ts#L241
    const suites = this.suite;
    const violations: any = [];
    this.getViolations(suites, violations);
    const violationsDecoded = violations
      .map((violation: { body: { toString: (arg0: string) => any } }) =>
        JSON.parse(violation.body.toString("utf-8"))
      )
      .filter((o: string | any[]) => o.length)
      .flat();
    const grouped = Object.groupBy(
      violationsDecoded,
      (o: { nodes: any[] }) => o.nodes[0].target
    );
    console.log(grouped);
    console.log(`Finished the run: ${result.status}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getViolations(suite: Suite | TestCase, res?: any) {
    if (suite.type === "test") {
      suite.results.forEach((result) => {
        res?.push(
          ...result.attachments
            .filter((attachment) => attachment.name === "violations")
            .map((attachment) => ({ ...attachment, title: suite.parent.title }))
        );
      });
    } else {
      suite.entries().forEach((s) => this.getViolations(s, res));
    }
  }
}

export default AxeSummaryReporter;
// Leach ansi strip here just in case I might need it later.
// // node_modules/ansi-regex/index.js
// function ansiRegex({ onlyFirst = false } = {}) {
//   const ST = "(?:\\u0007|\\u001B\\u005C|\\u009C)";
//   const pattern = [
//     `[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?${ST})`,
//     "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
//   ].join("|");
//   return new RegExp(pattern, onlyFirst ? void 0 : "g");
// }

// // node_modules/strip-ansi/index.js
// const regex = ansiRegex();
// function stripAnsi(string: string) {
//   if (typeof string !== "string") {
//     throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
//   }
//   return string.replace(regex, "");
// }
