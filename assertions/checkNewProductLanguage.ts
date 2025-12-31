import { expect, type Page } from "@playwright/test";

/**
 * Check for new product language: IntegrityCONNECT
 */
export async function checkNewProductLanguage(page: Page) {
  const newProductLanguage = "IntegrityCONNECT";
  const instancesOfNewProductLanguage = await page
    .getByText(newProductLanguage)
    .all();

  expect
    .soft(
      instancesOfNewProductLanguage.length,
      `NOT AN ERROR!! Instances of new product language "${newProductLanguage}" found on ${page.url()}`
    )
    .toEqual(0);
}
