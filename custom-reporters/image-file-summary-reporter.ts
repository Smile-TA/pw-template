import type {
  FullConfig,
  Reporter,
  Suite,
  TestCase,
} from "@playwright/test/reporter";

import { resetSummaries, writeSummary } from "./summaries";

class ImageFileSummaryReporter implements Reporter {
  private suite!: Suite;
  onBegin(config: FullConfig, suite: Suite): void {
    this.suite = suite;
    // Drop an earlier run's summaries (see custom-reporters/summaries.ts) so this run's
    // report can't link a stale one — CI reuses its workspace across builds.
    resetSummaries();
  }

  onEnd() {
    const images = this.getFailedImages(this.suite).flat();
    if (images.length === 0) {
      console.log(" No large file size images found!");
      return;
    }
    writeSummary("image-summary.json", JSON.stringify(images));
    console.log("The json image summary file has been saved!");
  }

  getFailedImages(suite: Suite | TestCase, res: string[] = []) {
    if (suite.type === "test") {
      suite.results.forEach((result) => {
        res?.push(
          ...result.attachments
            .filter((attachment) => attachment.name === "large-images")
            .map((attachment) => {
              const body = JSON.parse(attachment.body?.toString("utf-8") ?? "");
              return body;
            })
        );
      });
    } else {
      suite.entries().forEach((s) => this.getFailedImages(s, res));
    }
    return res;
  }
}

export default ImageFileSummaryReporter;
