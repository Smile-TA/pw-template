import { expect, type Page } from "@playwright/test";

export async function checkFavicon(page: Page) {
  const iconLinks = await page.locator('link[rel*="icon"]').all();
  for (const iconLink of iconLinks) {
    await expect
      .soft(iconLink, "favicon from ta-boilerplate should not exist")
      .not.toHaveAttribute("href", "ta-boilerplate");
  }
}
