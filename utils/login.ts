import { type Page } from "@playwright/test";

export async function login(page: Page) {
  await page.goto("/wp-login.php");
  await page.locator("#user_login").fill(process.env.ADMIN_USR_NAME ?? "");
  await page.locator("#user_pass").fill(process.env.ADMIN_USR_PSW ?? "");
  await page.locator("#wp-submit").click();
  const reminder = page.getByText("Remind me later");
  if (await reminder.isVisible()) {
    await reminder.click();
  }

  const updateDB = page.getByAltText("Update WordPress Database");
  if (await updateDB.isVisible()) {
    await updateDB.click();
  }
  await page.locator("#wp-admin-bar-site-name").click();
}
