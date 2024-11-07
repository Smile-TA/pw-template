import { expect, type Page } from "@playwright/test";

const textBody =
  "Any information that we collect when you opt into receiving SMS and MMS text messages from us is used solely for the management of such texting communications program.  We do not transfer your consent to be contacted via the texting program to any other entity.";

export async function checkPrivacyText(page: Page) {
  await expect
    .soft(page.getByText("INFORMATION COLLECTED FOR TEXTING PROGRAM"))
    .toBeVisible();
  await expect.soft(page.getByText(textBody)).toBeVisible();
}
