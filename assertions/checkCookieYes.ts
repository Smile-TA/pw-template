import { expect, type Page } from "@playwright/test";

/**
 * Checks that the cookie banner is present, the "Reject All" button is updated to say "Reject Optional",
 * and the british spelling is not used for the following words: "categorise", "customise", "analyse", "personalised".
 */
export async function checkCookieYes(page: Page) {
  const cookieBanner = page.locator("div.cky-consent-bar");
  const cookieModal = page.locator("div.cky-modal");
  const customizeButton = cookieBanner.locator("button", {
    hasText: /Customi[sz]e/,
  });
  const rejectAllButton = cookieBanner.locator("button", {
    hasText: /Reject All/,
  });
  const rejectOptionalButton = cookieBanner.locator("button", {
    hasText: /Reject Optional/,
  });

  const analyzeRegex = /analysed?/i;
  const categorizeRegex = /(un)?categorised?/i;
  const customizeRegex = /customise/i;
  const personalizeRegex = /personalise/i;

  await expect(cookieBanner).toBeVisible();
  await expect(rejectAllButton).not.toBeVisible();
  await expect(rejectOptionalButton).toBeVisible();

  await expect(cookieBanner).not.toHaveText(analyzeRegex);
  await expect(cookieBanner).not.toHaveText(categorizeRegex);
  await expect(cookieBanner).not.toHaveText(customizeRegex);
  await expect(cookieBanner).not.toHaveText(personalizeRegex);

  await customizeButton.click();
  await expect(cookieModal).toBeVisible();
  await expect(cookieModal).not.toHaveText(analyzeRegex);
  await expect(cookieModal).not.toHaveText(categorizeRegex);
  await expect(cookieModal).not.toHaveText(customizeRegex);
  await expect(cookieModal).not.toHaveText(personalizeRegex);
}
