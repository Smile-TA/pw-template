import { expect, type Page } from "@playwright/test";

/**
 * @see {@link https://github.com/microsoft/playwright/issues/9439#issuecomment-940871802}
 */
export async function checkOutboundLinks(
  page: Page,
  baseURL: string | undefined
) {
  const links = await page.evaluate(() => {
    return [...document.querySelectorAll("a")].map((link) => {
      return {
        href: link.getAttribute("href"),
        innerText: link.innerText,
        target: link.getAttribute("target"),
      };
    });
  });
  for (const link of links) {
    const href = link.href ?? "";
    if (
      !href ||
      href === "#" ||
      href === "/" ||
      href.slice(0, 4) === "tel:" ||
      href.slice(0, 7) === "mailto:" ||
      href.indexOf("http") !== 0 ||
      isSameOrigin(href, baseURL ?? "")
    ) {
      continue;
    }
    expect
      .soft(
        link.target,
        `link ${href} with text "${link.innerText}" should open in a new tab`
      )
      .toEqual("_blank");
  }
}

const isSameOrigin = (href: string, baseUrl: string): boolean => {
  const newHref = href.replace("www.", "");
  const newBase = baseUrl.replace("www.", "");
  return new URL(newHref).origin === new URL(newBase).origin;
};
