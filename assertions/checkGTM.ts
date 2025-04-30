import { expect, type Page } from "@playwright/test";

export async function checkGTM(page: Page) {
  const gtm = page.url().includes("planenroll")
    ? "GTM-T9PSFB6"
    : "GTM-5WZFJ3C9";
  const noscript = await page.evaluate((gtm) => {
    const el = [...document.querySelectorAll("noscript")].filter((e) =>
      e.innerText.includes(gtm)
    )[0];
    if (el) {
      return el?.innerText;
    }
  }, gtm);
  expect
    .soft(noscript, "No script tag should be correct")
    .toEqual(expect.stringContaining(gtm));
  await expect
    .soft(
      page.locator(`script[src$="${gtm}"]`),
      "Script tag with src should be correct"
    )
    .toHaveCount(1);

  const script = await page.evaluate((gtm) => {
    const el = [...document.querySelectorAll("script")].filter((e) =>
      e.innerText.includes(gtm)
    )[0];
    if (el) {
      return el?.innerText;
    }
  }, gtm);
  expect
    .soft(script, "Script tag without source should be correct")
    .toEqual(expect.stringContaining(gtm));
}
