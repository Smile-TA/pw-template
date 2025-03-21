import { test } from "@playwright/test";
import { checkWCAG } from "../assertions/checkWCAG";
import { pages } from "../pages";

pages.forEach((p) => {
  const pageName = p === "/" ? "Home Page" : p;
  test(`Check WCAG on ${pageName} page`, async ({ page }, testInfo) => {
    page.on("response", (data) => {
      if (
        data.status() === 429 ||
        data.statusText().toLocaleLowerCase().includes("too many requests")
      ) {
        // TODO: improve error visibility in the report.
        throw Error("Too many requests");
      }
    });
    await page.goto(p, {
      waitUntil: process.env.WAIT_UNTIL_OPTION as
        | "load"
        | "domcontentloaded"
        | "networkidle"
        | "commit",
    });
    await checkWCAG(page, testInfo);
  });
});
