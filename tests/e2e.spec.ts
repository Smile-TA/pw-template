import { expect, test, type Page } from "@playwright/test";
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

type WAIT_UNTIL_OPTION = "load" | "domcontentloaded" | "networkidle" | "commit";

// TODO: add image file size check 
pages.forEach((p) => {
  const pageName = p === "/" ? "Home" : p;
  test.describe(`test ${pageName} page`, () => {
    /**
     * @see {@link https://playwright.dev/docs/test-retries#reuse-single-page-between-tests Playwright doc reference}
     */
    let page: Page;
    const consoleErrors = new Map();
    const images: [string, number][] = [];

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      page.on("response", (data) => {
        if (
          data.status() === 429 ||
          data.statusText().toLocaleLowerCase().includes("too many requests")
        ) {
          // TODO: improve error visibility in the report.
          throw Error("Too many requests");
        }
      });

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          if (consoleErrors.has(page.url())) {
            consoleErrors.get(page.url()).push(msg.text());
          } else {
            consoleErrors.set(page.url(), [msg.text()]);
          }
        }
      });

      await page.route("**/*.{png,jpg,jpeg,svg}", async (route) => {
        const res = await route.fetch();
        if (res.headers()["content-length"]) {
          const len = Number.parseInt(res.headers()["content-length"]);
          images.push([route.request().url(), len]);
        }
        await route.fulfill();
      });

      page.on("pageerror", (error) => {
        if (consoleErrors.has(page.url())) {
          consoleErrors.get(page.url()).push(error.message);
        } else {
          consoleErrors.set(page.url(), [error.message]);
        }
      });

      await page.goto(p, {
        waitUntil: process.env.WAIT_UNTIL_OPTION as WAIT_UNTIL_OPTION,
      });
    });

    test.afterAll(async () => {
      await page.close();
    });
    test("Check Too Many Requests", async () => {
      await expect(page.getByText("too many requests")).not.toBeVisible();
    });
    test("Check favicon", async () => {
      await checkFavicon(page);
    });
    test("Check GTM", { tag: "@ProdOnly" }, async () => {
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

    //TODO: Add check internal links should not open in a new tab
    test("Check outbound links", async ({ baseURL }) => {
      await checkOutboundLinks(page, baseURL);
    });

    test("Check tel links match inner text", async () => {
      await checkTelLinks(page);
    });

    test(
      "Check staging links do not exist on prod",
      { tag: "@ProdOnly" },
      async () => {
        if (process.env.BASE_URL) {
          test.skip(
            process.env.BASE_URL.includes("staging"),
            "Staging links are checked only on production"
          );
        }
        await checkStagingLinks(page);
      }
    );

    test("Check robots", async () => {
      await checkRobots(page);
    });

    test("Check SEO", { tag: "@ProdOnly" }, async () => {
      if (process.env.BASE_URL) {
        test.skip(
          process.env.BASE_URL.includes("staging"),
          "SEO tags are only checked on production"
        );
        test.skip(
          p.includes("privacy") || p.includes("terms"),
          "SEO meta tag is not needed for this page."
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
    test("Check console errors", async () => {
      expect.soft(consoleErrors.get(page.url())).toBeUndefined();
    });
    test("Check image file sizes", async () => {
      const imageThresholdKB = 500 * 1000;
      for (const image of images) {
        expect
          .soft(
            image[1],
            `Image from ${image[0]} is larger than threshold of ${imageThresholdKB}`
          )
          .toBeLessThan(imageThresholdKB);
      }
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
  test.skip(
    !process.env.ADMIN_USR_NAME || !process.env.ADMIN_USR_PSW,
    "Admin credentials not provided"
  );
  await checkAdminEmail(page);
});

test("Check privacy page date and text", async ({ page }) => {
  const privacyPage = pages.find(
    (p) => p.includes("privacy") && p.indexOf("privacy") == 1
  );

  if (!privacyPage) {
    test.skip(!privacyPage, "Privacy Page not found");
  } else {
    await page.goto(privacyPage, {
      waitUntil: process.env.WAIT_UNTIL_OPTION as WAIT_UNTIL_OPTION,
    });
    await checkPrivacyText(page);
    await checkLastUpdated(page);
  }
});
