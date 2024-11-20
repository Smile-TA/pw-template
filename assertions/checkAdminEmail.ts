import { expect, type Page } from "@playwright/test";

const allowedEmails = [
  "webdev@thomasarts.com",
  "webdev@integritymarketing.com",
];

const disallowedEmails = [
  "gretchen.thomas@thomasarts.com",
  "albert.caminero@thomasarts.com",
];

export async function checkAdminEmail(page: Page) {
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

  await page.getByRole("menuitem", { name: "About WordPress" }).click();
  await page
    .locator("#menu-settings > .wp-has-submenu > .wp-menu-name")
    .click();

  const email = await page.locator("#new_admin_email").inputValue();
  expect.soft(disallowedEmails).not.toContain(email);
  expect.soft(allowedEmails).toContain(email);
}
