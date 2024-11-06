import { expect, type Page } from "@playwright/test";

export async function checkTelLinks(page: Page) {
  const links = await page.evaluate(() => {
    const keepOnlyNumbers = (s: string) =>
      s
        .split("")
        .filter((c) => c.charCodeAt(0) > 47 && c.charCodeAt(0) < 58)
        .join("");

    return [...document.querySelectorAll("a")]
      .filter((link) => link.getAttribute("href")?.indexOf("tel:") === 0)
      .map((link) => {
        const hrefTel = keepOnlyNumbers(link.getAttribute("href") ?? "");
        const textTel = keepOnlyNumbers(link.innerText);
        return {
          href: hrefTel,
          innerText: textTel,
        };
      });
  });
  for (const link of links) {
    expect.soft(link.href).toContain(link.innerText.slice(0, link.href.length));
  }
}
