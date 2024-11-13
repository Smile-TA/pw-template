import { test, expect, type Page } from "@playwright/test";

const sizes: { width: number; height: number }[] = [];
const chunks: { width: number; height: number }[][] = [];

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

async function assertNavVisible(
  page: Page,
  chunk: { width: number; height: number }[]
) {
  await page.goto("/");
  for (const size of chunk) {
    await page.setViewportSize({ ...size });
    // TODO: Better to use "or" to and provide two custom selectors per website. 
    const nav = page.getByRole("navigation").first();
    // TODO: Find and test on a broken site
    await expect(
      nav,
      `Nav is not visible at ${size.width} px width`
    ).toBeVisible();
  }
}

// npx playwright test --headed --project="nav-visibility" -> for demo only, will fail on timeout
