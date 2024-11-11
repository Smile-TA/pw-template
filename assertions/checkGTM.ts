import { expect, type Page } from "@playwright/test";

export async function checkGTM(page: Page) {
  if (page.url().includes("staging")) {
    return;
  }
  const noscript = await page.evaluate(() => {
    const el = [...document.querySelectorAll("noscript")].filter((e) =>
      e.innerText.includes("GTM-5WZFJ3C9")
    )[0];
    if (el) {
      return el?.innerText;
    }
  });
  expect
    .soft(noscript, "No script tag should be correct")
    .toEqual(expect.stringContaining("GTM-5WZFJ3C9"));
  await expect
    .soft(
      page.locator('script[src$="GTM-5WZFJ3C9"]'),
      "Script tag with src should be correct"
    )
    .toHaveCount(1);

  const script = await page.evaluate(() => {
    const el = [...document.querySelectorAll("script")].filter((e) =>
      e.innerText.includes("GTM-5WZFJ3C9")
    )[0];
    if (el) {
      return el?.innerText;
    }
  });
  expect
    .soft(script, "Script tag without source should be correct")
    .toEqual(expect.stringContaining("GTM-5WZFJ3C9"));
}
