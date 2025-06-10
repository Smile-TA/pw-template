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
    if (violationsDecoded.length === 0) {
      console.log("No WCAG violations to summarize!");
      return;
    }
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
    this.writeJSONSummary(nodes);
    this.writeCSVSummary(nodes);
  }

  writeJSONSummary(nodes: violationNode[]) {
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
        pageCount: number;
        pages: { url: string; testId: string }[];
      };
    } = {};
    for (const [k, v] of grouped) {
      const { description, help, helpUrl, impact } = v[0];
      reduced[k] = {
        description,
        help,
        helpUrl,
        impact,
        pageCount: v.length,
        pages: [],
      };
      reduced[k].pages = v.map(({ url, testId }) => ({ url, testId }));
    }
    const filePath = path.join(process.cwd(), "wcag-summary", "summary.json");
    fs.writeFile(filePath, JSON.stringify(reduced), (err) => {
      if (err) throw err;
      console.log("The json wcag summary file has been saved!");
    });
  }

  writeCSVSummary(nodes: violationNode[]) {
    const filePath = path.join(process.cwd(), "wcag-summary", "summary.csv");
    const headers = [
      "url",
      "testId",
      "description",
      "help",
      "helpUrl",
      "impact",
      "target",
    ];
    let outString = "";
    outString +=
      Object.keys(nodes[0] ? nodes[0] : {})
        .filter((k) => headers.includes(k))
        .join(",") + "\n";
    outString += nodes
      .map((node) =>
        Object.entries(node)
          .map((cell) => {
            if (headers.includes(cell[0])) {
              return `"${
                typeof cell[1] === "string"
                  ? cell[1].replaceAll("\n", " ")
                  : cell[1].join("").replaceAll('"', "'")
              }"`;
            }
            return null;
          })
          .filter(Boolean)
          .join(",")
      )
      .join("\n");
    fs.writeFile(filePath, outString, (err) => {
      if (err) throw err;
      console.log("The csv wcag summary file has been saved!");
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
