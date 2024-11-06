import { expect, type Page } from "@playwright/test";

export async function checkSkipLink(page: Page) {
  const skipLink = page.locator("#int-skip a");
  await expect.soft(skipLink).toContainText("Skip to ", { ignoreCase: true });
  await expect.soft(skipLink).toHaveAttribute("href", "#int-content");

  await expect.soft(page.locator("#int-content")).toBeVisible();
}
