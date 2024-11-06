import { expect, type Page } from "@playwright/test";

export async function checkText(page: Page) {
  await expect.soft(page.getByText("Lorem Ipsum")).not.toBeVisible();
  await expect
    .soft(page.getByText("[Insert Company Party Name]"))
    .not.toBeVisible();
  await expect.soft(page.getByText(/\{(.*?)\}/)).not.toBeVisible();
  await expect.soft(page.getByText(/\[(.*?)\]/)).not.toBeVisible();
  await expect.soft(page.getByText("Hello world")).not.toBeVisible();
}
