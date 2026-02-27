import { expect, type Page } from "@playwright/test";
import { login } from "../utils/login";

export async function checkPlugins(page: Page) {
  const requiredPlugins = [
    "Yoast SEO",
    "All-in-One WP Migration and Backup",
    "Wordfence Security",
  ];

  await login(page);
  await page.goto("/wp-admin/plugins.php");
  const pluginTitleCell = page.locator("td.plugin-title strong");
  for (const plugin of requiredPlugins) {
    await expect
      .soft(page.getByText(plugin, { exact: true }).and(pluginTitleCell))
      .toBeVisible();
  }
}
