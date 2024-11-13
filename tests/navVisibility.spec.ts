import { test, expect, type Page } from "@playwright/test";

interface Size {
  width: number;
  height: number;
}

const sizes: Size[] = [];
const chunks: Size[][] = [];

test.describe.configure({ mode: "parallel" });

// test.setTimeout(60 * 1000);

test.beforeAll("setup chunks", () => {
  for (let w = 360; w <= 2001; w++) {
    sizes.push({ width: w, height: 1000 });
  }
  const chunkSize = Math.floor(sizes.length / 5);
  for (let i = 0; i < sizes.length; i += chunkSize) {
    const start = i;
    const end = i + chunkSize;
    chunks.push(sizes.slice(start, end));
  }
});

test("Check nav at all sizes first chunk", async ({ page }) => {
  await assertNavVisible(page, chunks[0]);
});
test("Check nav at all sizes second chunk", async ({ page }) => {
  await assertNavVisible(page, chunks[1]);
});
test("Check nav at all sizes third chunk", async ({ page }) => {
  await assertNavVisible(page, chunks[2]);
});
test("Check nav at all sizes fourth chunk", async ({ page }) => {
  await assertNavVisible(page, chunks[3]);
});
test("Check nav at all sizes fifth chunk", async ({ page }) => {
  await assertNavVisible(page, chunks[4]);
});

async function assertNavVisible(page: Page, chunk: Size[]) {
  await page.goto("/");
  for (const size of chunk) {
    await page.setViewportSize({ ...size });
    const menu = page.locator(process.env.NAV_SELECTOR_MENU ?? "");
    const toggle = page.locator(process.env.NAV_SELECTOR_TOGGLE ?? "");
    if (await menu.isVisible()) {
      await expect(
        toggle,
        `Toggle should not be visible at ${size.width} px width`
      ).not.toBeVisible();
      await expect(
        menu,
        `Menu should be visible at ${size.width} px width`
      ).toBeVisible();
    } else {
      await expect(
        toggle,
        `Toggle should be visible at ${size.width} px width`
      ).toBeVisible();
      await expect(
        menu,
        `Menu should not be visible at ${size.width} px width`
      ).not.toBeVisible();
    }
    // TODO: Find and test on a broken site
  }
}

// npx playwright test --headed --project="nav-visibility" -> for demo only, will fail on timeout
