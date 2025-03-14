import { firefox, chromium, webkit, test, Page } from "@playwright/test";
import { pages } from "../pages";

const browserPages: { [key: string]: Page } = {};

test.beforeAll(async () => {
  for (const b of [firefox, chromium, webkit]) {
    const launched = await b.launch();
    browserPages[b.name()] = await launched.newPage();
  }
});

pages.forEach((p) => {
  test(`compare ${p} across browsers`, async () => {});
});
