import { test, type Page } from "@playwright/test";
import { allDomains } from "../all-domains";

import { checkCookieYes } from "../assertions/checkCookieYes";
import { checkLegalLinks } from "../assertions/checkLegalLinks";
import { checkGTM } from "../assertions/checkGTM";

allDomains.forEach((d) => {
  test.describe(`test ${d} domain`, () => {
    /**
     * @see {@link https://playwright.dev/docs/test-retries#reuse-single-page-between-tests Playwright doc reference}
     */
    let page: Page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto(d);
    });

    test.afterAll(async () => {
      await page.close();
    });

    test("check cookie consent", async ({}) => {
      await checkCookieYes(page);
    });
    test("check legal links", async () => {
      await checkLegalLinks(page);
    });
    test("Check GTM", async ({}) => {
      await checkGTM(page);
    });
  });
});
