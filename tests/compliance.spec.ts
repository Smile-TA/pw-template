import { test, expect } from "@playwright/test";
import {
  privacyPolicyParagraphs,
  consumerHealthParagraphs,
  trustArcLinks,
} from "../complianceContent";
import { checkH1Count } from "../assertions/checkH1";
import { checkOutboundLinks } from "../assertions/checkOutboundLinks";
import { checkStagingLinks } from "../assertions/checkStagingLinks";
import { checkRobots } from "../assertions/checkRobots";
import { checkTelLinks } from "../assertions/checkTelLinks";
import { checkWCAG } from "../assertions/checkWCAG";
import { checkFavicon } from "../assertions/checkFavicon";
import { checkText } from "../assertions/checkText";
import playwrightConfig from "../playwright.config";

if (!playwrightConfig.use?.baseURL) {
  throw Error("Base url is missing");
}
const trustArcUrl = trustArcLinks[playwrightConfig.use?.baseURL];
const privacyPolicyUrl = process.env.PRIVACY_POLICY_LINK ?? "/privacy-policy";
const consumerHealthUrl =
  process.env.CONSUMER_HEALTH_LINK ?? "/consumer-health-data-policy/";
test.describe("privacy page", () => {
  test("test trust arc url", async ({ page }) => {
    expect(trustArcUrl).toBeTruthy();
    await page.goto(privacyPolicyUrl);
    // should be 6 (including 1 in the footer)
    const links = page.locator(`a[href="${trustArcUrl}"]`);
    await expect(links).toHaveCount(6);
  });
  test("placeholder text should not be visible", async ({ page }) => {
    await page.goto(privacyPolicyUrl);
    const placeholders = [
      "[INSERT DATE]",
      "[INSERT BUSINESS UNIT (“BU” NAME]",
      "[INSERT BU URLs]",
      "[INSERT]",
    ];
    for (const placeholder of placeholders) {
      await expect(
        page.getByText(placeholder, { exact: true })
      ).not.toBeVisible();
    }
  });

  test("standard assertions from e2e test", async ({
    page,
    baseURL,
  }, testInfo) => {
    await page.goto(privacyPolicyUrl);
    await checkH1Count(page);
    await checkOutboundLinks(page, baseURL);
    await checkStagingLinks(page);
    await checkRobots(page);
    await checkTelLinks(page);
    await checkText(page);
    await checkFavicon(page);
    await checkWCAG(page, testInfo);
  });

  const chunkSize = 10;
  for (let i = 0; i < privacyPolicyParagraphs.length; i += chunkSize) {
    const chunks = privacyPolicyParagraphs.slice(i, i + chunkSize);
    test(`verify content at chunk ${i}`, async ({ page }) => {
      await page.goto(privacyPolicyUrl);
      for (const chunk of chunks) {
        if (Array.isArray(chunk)) {
          await expect
            .soft(page.getByText(chunk[0], { exact: false }))
            .toHaveCount(parseInt(chunk[1]));
        } else {
          await expect
            .soft(page.getByText(chunk, { exact: false }))
            .toBeVisible();
        }
      }
    });
  }
});

test.describe("consumer health data", () => {
  test("test trust arc url", async ({ page }) => {
    await page.goto(consumerHealthUrl);
    const links = page.locator(`a[href="${trustArcUrl}"]`);
    await expect(links).toHaveCount(3);
  });
  test("standard assertions from e2e test", async ({
    page,
    baseURL,
  }, testInfo) => {
    await page.goto(consumerHealthUrl);
    await checkH1Count(page);
    await checkOutboundLinks(page, baseURL);
    await checkStagingLinks(page);
    await checkRobots(page);
    await checkTelLinks(page);
    await checkText(page);
    await checkFavicon(page);
    await checkWCAG(page, testInfo);
  });
  const chunkSize = 10;
  for (let i = 0; i < consumerHealthParagraphs.length; i += chunkSize) {
    const chunks = consumerHealthParagraphs.slice(i, i + chunkSize);
    test(`verify content at chunk ${i}`, async ({ page }) => {
      await page.goto(consumerHealthUrl);
      for (const chunk of chunks) {
        if (Array.isArray(chunk)) {
          await expect
            .soft(page.getByText(chunk[0], { exact: false }))
            .toHaveCount(parseInt(chunk[1]));
        } else {
          await expect
            .soft(page.getByText(chunk, { exact: false }))
            .toBeVisible();
        }
      }
    });
  }
});
