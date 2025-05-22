import { expect, type Page } from "@playwright/test";

export async function checkTelLinks(page: Page) {
  const links = await page.evaluate(() => {
    const keepOnlyNumbers = (s: string) =>
      s
        .split("")
        .filter((c) => c.charCodeAt(0) > 47 && c.charCodeAt(0) < 58)
        .join("");

    const removeLeadingOne = (s: string) => {
      if (s[0] === "1") {
        return s.replace("1", "");
      }
      return s;
    };
    return [...document.querySelectorAll("a")]
      .filter((link) => link.getAttribute("href")?.indexOf("tel:") === 0)
      .map((link) => {
        const hrefTel = removeLeadingOne(
          keepOnlyNumbers(link.getAttribute("href") ?? "")
        );
        const textTel = removeLeadingOne(keepOnlyNumbers(link.innerText));
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
