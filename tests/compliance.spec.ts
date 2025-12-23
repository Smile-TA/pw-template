import { test } from "@playwright/test";
import { checkCookieYes } from "../assertions/checkCookieYes";

test("check cookie consent", async ({ page }) => {
  await page.goto("");
  await checkCookieYes(page);
});
