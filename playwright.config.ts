import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

if (!process.env.BASE_URL) {
  throw new Error("Base url is missing");
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list"],
    ["html", { open: "always" }],
    ["./custom-reporters/axe-summary-reporter.ts"],
    ["./custom-reporters/image-file-summary-reporter.ts"],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
  },

  projects: [
    {
      name: "compliance",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "compliance.spec.ts",
    },
    {
      name: "setup",
      testMatch: "**/*.setup.ts",
    },
    {
      name: "e2e",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /\b(wcag.spec.ts|e2e.spec.ts)\b/,
    },
    // TODO: Change to use temporary dir or add cleanup step
    {
      name: "e2e-auth",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      testMatch: /\b(wcag.spec.ts|e2e.spec.ts)\b/,
      dependencies: ["setup"],
    },

    {
      name: "nav-visibility",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "navVisibility.spec.ts",
    },

    /**
     * Run VRT accross browsers
     */
    {
      name: "cross-browser-vrt",
      testMatch: "crossBrowserVrt.spec.ts",
    },

    /*
     * Run VRT on different viewport sizes.
     * To run only vrt projects: npx playwright test --project="vrt-*"
     * To update changes: npx playwright test --project="vrt-*" --update-snapshots
     */
    {
      name: "vrt-small",
      use: { ...devices["Galaxy S5"] },
      testMatch: "vrt.spec.ts",
    },
    {
      name: "vrt-medium",
      use: { ...devices["iPad (gen 5)"] },
      testMatch: "vrt.spec.ts",
    },
    {
      name: "vrt-large",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "vrt.spec.ts",
    },
    {
      name: "vrt-small-auth",
      use: {
        ...devices["Galaxy S5"],
        storageState: "playwright/.auth/user.json",
      },
      testMatch: "vrt.spec.ts",
      dependencies: ["setup"],
    },
    {
      name: "vrt-medium-auth",
      use: {
        ...devices["iPad (gen 5)"],
        storageState: "playwright/.auth/user.json",
      },
      testMatch: "vrt.spec.ts",
      dependencies: ["setup"],
    },
    {
      name: "vrt-large-auth",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      testMatch: "vrt.spec.ts",
      dependencies: ["setup"],
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
