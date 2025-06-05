import { test } from "@playwright/test";
import { checkTelLinks } from "../assertions/checkTelLinks";

const repeatAmount = 10;
test.describe.configure({ mode: "parallel" });
test.describe(`Repeat check tel test ${repeatAmount} times`, () => {
  for (let i = 1; i <= repeatAmount; i++) {
    test(`Check tel -- Test number:${i}`, async ({ page }) => {
      await page.goto("");
      await page.waitForTimeout(1000);
      await checkTelLinks(page);
    });
  }
});
