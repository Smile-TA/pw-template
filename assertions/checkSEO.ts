import { expect, type Page } from "@playwright/test";

export async function checkSEO(page: Page) {
  const meta = page.locator('meta[name="description"]');
  await expect.soft(meta).toHaveAttribute("content");
  const metaContent = await meta.getAttribute("content");
  expect.soft(metaContent?.length).toBeGreaterThan(0);

  const og = page.locator('meta[property="og:description"]');
  await expect.soft(og).toHaveAttribute("content");
  const ogContent = await og.getAttribute("content");
  expect.soft(ogContent?.length).toBeGreaterThan(0);
}
