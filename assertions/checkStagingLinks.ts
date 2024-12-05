import { expect, type Page } from "@playwright/test";

export async function checkStagingLinks(page: Page) {
  const links = await page.evaluate(() => {
    return [...document.querySelectorAll("a")].filter((link) =>
      link.getAttribute("href")?.includes("staging")
    );
  });
  expect.soft(links.length).toEqual(0);
}
