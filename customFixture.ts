import { test as base } from "@playwright/test";
import { checkH1Count } from "./assertions/checkH1";
import { checkGTM } from "./assertions/checkGTM";
import { checkFavicon } from "./assertions/checkFavicon";
import { checkOutboundLinks } from "./assertions/checkOutboundLinks";
import { checkTelLinks } from "./assertions/checkTelLinks";
import { checkRobots } from "./assertions/checkRobots";
import { checkAdminEmail } from "./assertions/checkAdminEmail";
import { checkSkipLink } from "./assertions/checkSkipLink";
import { checkLastUpdated } from "./assertions/checkLastUpdated";
import { checkSEO } from "./assertions/checkSEO";
import { checkText } from "./assertions/checkText";
import { checkPrivacyText } from "./assertions/checkPrivacyText";
import { checkStagingLinks } from "./assertions/checkStagingLinks";
import { scrollToBottom } from "./utils/scrollToBottom";
import { checkLegalLinks } from "./assertions/checkLegalLinks";

export const test = base.extend({
  checkH1Count: async ({}, use) => {
    await use(checkH1Count);
  },
  checkGTM: async ({}, use) => {
    await use(checkGTM);
  },
  checkFavicon: async ({}, use) => {
    await use(checkFavicon);
  },
  checkOutboundLinks: async ({}, use) => {
    await use(checkOutboundLinks);
  },
  checkTelLinks: async ({}, use) => {
    await use(checkTelLinks);
  },
  checkRobots: async ({}, use) => {
    await use(checkRobots);
  },
  checkAdminEmail: async ({}, use) => {
    await use(checkAdminEmail);
  },
  checkSkipLink: async ({}, use) => {
    await use(checkSkipLink);
  },
  checkLastUpdated: async ({}, use) => {
    await use(checkLastUpdated);
  },
  checkSEO: async ({}, use) => {
    await use(checkSEO);
  },
  checkText: async ({}, use) => {
    await use(checkText);
  },
  checkPrivacyText: async ({}, use) => {
    await use(checkPrivacyText);
  },
  checkStagingLinks: async ({}, use) => {
    await use(checkStagingLinks);
  },
  scrollToBottom: async ({}, use) => {
    await use(scrollToBottom);
  },
  checkLegalLinks: async ({}, use) => {
    await use(checkLegalLinks);
  },
});

export { expect, type Page } from "@playwright/test";
