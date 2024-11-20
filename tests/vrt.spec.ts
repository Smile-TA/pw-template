import { test, expect } from "@playwright/test";
import { pages } from "../pages";
import path from "path";

pages.forEach((p) => {
  const pageName = p === "/" ? "Home" : p;
  test(`Do full page vrt for ${pageName} page`, async ({ page }) => {
    await page.goto(p);
    await expect(page).toHaveScreenshot({
      fullPage: true,
      stylePath: path.join(__dirname, "../utils/screenshot.css"),
      timeout: 15000,
    });
  });
});
