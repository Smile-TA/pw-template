import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");
// TODO: Investigate if the setup file should live in its own dir
setup("authenticate", async ({ page }) => {
  await page.goto("/wp-login.php");
  await page
    .getByLabel("Username or email address")
    .fill(process.env.TEST_USR_NAME ?? "");
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.TEST_USR_PSW ?? "");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(
    page.getByText("ERROR: The username or password you entered is incorrect.")
  ).not.toBeVisible();
  await page.context().storageState({ path: authFile });
});
