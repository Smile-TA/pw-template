import { expect, type Page } from "@playwright/test";

export async function checkRobots(page: Page) {
  const meta = page.locator('meta[name*="robots"]');
  const isStaging = page.url().includes("staging");
  if (isStaging) {
    await expect.soft(meta).toHaveAttribute("content", "noindex, nofollow");
  } else {
    await expect.soft(meta).not.toHaveAttribute("content", "noindex, nofollow");
  }
}
