import { expect, type Page } from "@playwright/test";

export async function checkH1Count(page: Page) {
  await expect
    .soft(page.locator("h1"), "Page should have only one h1 element")
    .toHaveCount(1);
}
