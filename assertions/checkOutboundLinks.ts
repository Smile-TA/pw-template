import { expect, type Page } from "@playwright/test";

/**
 * @see {@link https://github.com/microsoft/playwright/issues/9439#issuecomment-940871802}
 */
export async function checkOutboundLinks(
  page: Page,
  baseURL: string | undefined
) {
  let newBaseUrl: string = baseURL ?? "";
  newBaseUrl = newBaseUrl.endsWith("/") ? newBaseUrl.slice(0, -1) : newBaseUrl;
  newBaseUrl = newBaseUrl.indexOf("www.")
    ? newBaseUrl.replace("www.", "")
    : newBaseUrl;
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
      getLinkBaseURL(href) === newBaseUrl
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

const getLinkBaseURL = (href: string): string => {
  const pathArray = href.split("/");
  const protocol = pathArray[0];
  const host = pathArray[2];
  const url = protocol + "//" + host.replace("www.", "");
  return url.endsWith("/") ? url.slice(0, -1) : url;
};
