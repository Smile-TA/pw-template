import { firefox, chromium, webkit, test, expect } from "@playwright/test";
import { pages } from "../pages";
import path from "path";
const options = {
  screen: {
    width: 1792,
    height: 1120,
  },
  viewport: {
    width: 1280,
    height: 720,
  },
};

const screenshotOption = {
  fullPage: true,
  stylePath: path.join(__dirname, "../utils/screenshot.css"),
  maxDiffPixelRatio: 0.2,
};

test.describe("compare vrt across browsers", () => {
  pages.forEach((p) => {
    const screenshotName =
      p === "/" ? "home.png" : p.replaceAll("/", "").concat(".png");
    test(`compare ${p === "/" ? "Home" : p} chrome to chrome`, async () => {
      const chromePage = await (await chromium.launch()).newPage(options);
      await chromePage.goto(p);
      await expect(chromePage).toHaveScreenshot(
        screenshotName,
        screenshotOption
      );
    });
    test(`compare ${p} chrome to firefox`, async () => {
      const firefoxPage = await (await firefox.launch()).newPage(options);
      await firefoxPage.goto(p);
      await expect(firefoxPage).toHaveScreenshot(
        screenshotName,
        screenshotOption
      );
    });

    test(`compare ${p} chrome to webkit`, async () => {
      const webkitPage = await (await webkit.launch()).newPage(options);
      await webkitPage.goto(p);
      await expect(webkitPage).toHaveScreenshot(
        screenshotName,
        screenshotOption
      );
    });
  });
});
