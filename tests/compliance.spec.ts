import { test } from "@playwright/test";
import { checkCookieYes } from "../assertions/checkCookieYes";
import { checkNewProductLanguage } from "../assertions/checkNewProductLanguage";
import { checkOldProductLanguage } from "../assertions/checkOldProductLanguage";

test("check cookie consent", async ({ page }) => {
  await page.goto("");
  await checkCookieYes(page);
});

test("check old and new product language", async ({ page }) => {
  await page.goto("");
  await checkOldProductLanguage(page);
  await checkNewProductLanguage(page);
});
