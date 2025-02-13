import { test, expect } from "@playwright/test";
import { privacyPolicyParagraphs } from "../complianceContent";

const trustArcUrl: string | undefined = process.env.TRUSTARC_URL;
const privacyPolicyUrl = "/privacy-notice";
test.describe("privacy page", () => {
  test("test trust arc url", async ({ page }) => {
    expect(trustArcUrl).toBeTruthy();
    await page.goto(privacyPolicyUrl);
    // should be 6 (including 1 in the footer)
    const links = page.locator(`a[href="${trustArcUrl}"]`);
    await expect(links).toHaveCount(6);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute("target", "_blank");
    }
  });
  test("placeholder text should not be visible", async ({ page }) => {
    await page.goto(privacyPolicyUrl);
    const placeholders = [
      "[INSERT DATE]",
      "[INSERT BUSINESS UNIT (“BU” NAME]",
      "[INSERT BU URLs]",
      "[INSERT]",
    ];
    for (const placeholder in placeholders) {
      await expect(
        page.getByText(placeholder, { exact: true })
      ).not.toBeVisible();
    }
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
    await page.goto("/consumer-health-data-privacy-notice/");
    const links = page.locator(`a[href="${trustArcUrl}"]`);
    await expect(links).toHaveCount(3);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute("target", "_blank");
    }
  });
});
