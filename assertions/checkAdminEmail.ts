import { expect, type Page } from "@playwright/test";
import { login } from "../utils/login";

const allowedEmails = [
  "webdev@thomasarts.com",
  "webdev@integritymarketing.com",
];

const disallowedEmails = [
  "gretchen.thomas@thomasarts.com",
  "albert.caminero@thomasarts.com",
];

export async function checkAdminEmail(page: Page) {
  await login(page);
  await page
    .locator("#menu-settings > .wp-has-submenu > .wp-menu-name")
    .click();

  const email = await page.locator("#new_admin_email").inputValue();
  expect.soft(disallowedEmails).not.toContain(email);
  expect.soft(allowedEmails).toContain(email);
}
