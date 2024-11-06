import { test } from "@playwright/test";
import { checkWCAG } from "../assertions/checkWCAG";
import { pages } from "../pages";

pages.forEach((p) => {
  const pageName = p === "/" ? "Home Page" : p;
  test(`Check WCAG on ${pageName} page`, async ({ page }, testInfo) => {
    await page.goto(p);
    await checkWCAG(page, testInfo);
  });
});
