import { expect, type Page, type TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHtmlReport } from "axe-html-reporter";

export async function checkWCAG(page: Page, testInfo: TestInfo) {
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags([
      "wcag2a",
      "wcag2aa",
      "wcag21a",
      "wcag21aa",
      "wcag22aa",
      "best-practice",
    ])
    .analyze();

  const reportHTML = createHtmlReport({
    results: accessibilityScanResults,
    options: {
      projectKey: `${page.url()}`,
    },
  });

  await testInfo.attach("accessibility-scan-results", {
    body: reportHTML,
    contentType: "text/html",
  });

  await testInfo.attach("axe-results", {
    body: JSON.stringify(accessibilityScanResults),
    contentType: "application/json",
  });

  expect
    .soft(
      accessibilityScanResults.violations,
      "Check that there are no wcag violations"
    )
    .toEqual([]);
}
