import { expect, type Page } from "@playwright/test";

/**
 * Check for any old product language: LeadCENTER, MedicareCENTER, LifeCENTER
 */
export async function checkOldProductLanguage(page: Page) {
  const oldProductLanguages = ["LeadCENTER", "MedicareCENTER", "LifeCENTER"];
  for (const oldProductLanguage of oldProductLanguages) {
    const instancesOfOldProductLanguage = await page
      .getByText(oldProductLanguage)
      .all();

    expect
      .soft(
        instancesOfOldProductLanguage.length,
        `Instances of old product language "${oldProductLanguage}" found on ${page.url()}`
      )
      .toEqual(0);
  }
}
