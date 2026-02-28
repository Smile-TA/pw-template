import { expect, type Page } from "@playwright/test";
import { login } from "../utils/login";

export async function checkPlugins(page: Page) {
  const requiredPlugins = [
    "Yoast SEO",
    "All-in-One WP Migration and Backup",
    [
      "All-in-One WP Migration URL Extension",
      "All-in-One WP Migration Unlimited Extension",
    ],
    "Wordfence Security",
  ];

  await login(page);
  await page.goto("/wp-admin/plugins.php");
  const pluginTitleCell = page.locator("td.plugin-title strong");
  for (const plugin of requiredPlugins) {
    if (Array.isArray(plugin)) {
      await expect
        .soft(
          page
            .getByText(plugin[0], { exact: true })
            .or(page.getByText(plugin[1], { exact: true }))
            .first()
            .and(pluginTitleCell),
        )
        .toBeVisible();
    } else if (typeof plugin === "string") {
      await expect
        .soft(page.getByText(plugin, { exact: true }).and(pluginTitleCell))
        .toBeVisible();
    }
  }
}
