import { test, expect } from "@playwright/test";

const trustArcUrl: string | undefined = process.env.TRUSTARC_URL;
test.describe("privacy page", () => {
  test("test trust arc url", async ({ page }) => {
    expect(trustArcUrl).toBeTruthy();
    await page.goto("/privacy-policy");
    // should be 6 (including 1 in the footer)
    const links = page.locator(`a[href="${trustArcUrl}"]`);
    await expect(links).toHaveCount(6);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute("target", "_blank");
    }
  });
  test("placeholder text should not be visible", async ({ page }) => {
    await page.goto("/privacy-policy");
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
});

test.describe("consumer health data", () => {
  test("test trust arc url", async ({ page }) => {
    await page.goto("/consumer-health-data-privacy-notice/");
    const links = page.locator(`a[href="${trustArcUrl}"]`);
    await expect(links).toHaveCount(3);
  });
});
