import { test, type Page } from "@playwright/test";
import { checkH1Count } from "../assertions/checkH1";
import { checkGTM } from "../assertions/checkGTM";
import { checkFavicon } from "../assertions/checkFavicon";
import { checkOutboundLinks } from "../assertions/checkOutboundLinks";
import { checkTelLinks } from "../assertions/checkTelLinks";
import { checkRobots } from "../assertions/checkRobots";
import { checkAdminEmail } from "../assertions/checkAdminEmail";
import { checkSkipLink } from "../assertions/checkSkipLink";
import { checkLastUpdated } from "../assertions/checkLastUpdated";
import { checkSEO } from "../assertions/checkSEO";
import { checkText } from "../assertions/checkText";
import { checkPrivacyText } from "../assertions/checkPrivacyText";
import { pages } from "../pages";
import { checkStagingLinks } from "../assertions/checkStagingLinks";

// TODO: Add too many requests listener. Stop all workers.

pages.forEach((p) => {
  const pageName = p === "/" ? "Home" : p;
  test.describe(`test ${pageName} page`, () => {
    /**
     * @see {@link https://playwright.dev/docs/test-retries#reuse-single-page-between-tests Playwright doc reference}
     */
    let page: Page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto(p);
    });
    test.afterAll(async () => {
      await page.close();
    });

    test("Check favicon", async () => {
      await checkFavicon(page);
    });
    test("Check GTM", async () => {
      if (process.env.BASE_URL) {
        test.skip(
          process.env.BASE_URL.includes("staging"),
          "GTM is only checked on production"
        );
      }
      await checkGTM(page);
    });

    test("Check h1 count", async () => {
      await checkH1Count(page);
    });

    test("Check outbound links", async ({ baseURL }) => {
      await checkOutboundLinks(page, baseURL);
    });

    test("Check tel links match inner text", async () => {
      await checkTelLinks(page);
    });

    test("Check staging links do not exist on prod", async () => {
      if (process.env.BASE_URL) {
        test.skip(
          process.env.BASE_URL.includes("staging"),
          "Staging links are checked only on production"
        );
      }
      await checkStagingLinks(page);
    });

    test("Check robots", async () => {
      await checkRobots(page);
    });

    test("Check SEO", async () => {
      if (process.env.BASE_URL) {
        test.skip(
          process.env.BASE_URL.includes("staging"),
          "SEO tags are only checked on production"
        );
        test.skip(
          p.includes("privacy") || p.includes("terms"),
          "SEO meta tags is not needed for this page."
        );
      }
      await checkSEO(page);
    });

    test("Check skip link", async () => {
      await checkSkipLink(page);
    });

    test("Check that placeholder text does not exist", async () => {
      await checkText(page);
    });
  });
});

test("Check Admin Email", async ({ page }) => {
  if (process.env.BASE_URL) {
    test.skip(
      process.env.BASE_URL.includes("staging"),
      "Admin email is only checked on production"
    );
  }
  await checkAdminEmail(page);
});

test("Check privacy page date and text", async ({ page }) => {
  const privacyPage = pages.find((p) => p.includes("privacy"));

  if (!privacyPage) {
    test.skip(!privacyPage, "Privacy Page not found");
  } else {
    await page.goto(privacyPage);
    await checkLastUpdated(page);
    await checkPrivacyText(page);
  }
});
