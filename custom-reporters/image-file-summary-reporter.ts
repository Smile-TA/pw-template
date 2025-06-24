import type {
  FullConfig,
  Reporter,
  Suite,
  TestCase,
} from "@playwright/test/reporter";

import fs from "node:fs";
import path from "path";

class ImageFileSummaryReporter implements Reporter {
  private suite!: Suite;
  onBegin(config: FullConfig, suite: Suite): void {
    this.suite = suite;
  }

  onEnd() {
    const images = this.getFailedImages(this.suite).flat();
    if (images.length === 0) {
      console.log(" No large file size images found!");
      return;
    }
    const filePath = path.join(
      process.cwd(),
      "summaries",
      "image-summary.json"
    );
    fs.writeFile(filePath, JSON.stringify(images), (err) => {
      if (err) throw err;
      console.log("The json image summary file has been saved!");
    });
  }

  getFailedImages(suite: Suite | TestCase, res: string[] = []) {
    if (suite.type === "test") {
      suite.results.forEach((result) => {
        res?.push(
          ...result.attachments
            .filter((attachment) => attachment.name === "large-images")
            .map((attachment) => {
              const body = JSON.parse(attachment.body?.toString("utf-8") ?? "");
              return body.map((attachment: string[]) => attachment[0]);
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
