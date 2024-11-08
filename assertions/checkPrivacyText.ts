import { expect, type Page } from "@playwright/test";

const textBody =
  "Any information that we collect when you opt into receiving SMS and MMS text messages from us is used solely for the management of such texting communications program.  We do not transfer your consent to be contacted via the texting program to any other entity.";

export async function checkPrivacyText(page: Page) {
  await expect(
    page.getByRole("link", {
      name: "Information Collected for Texting Program",
    })
  ).toHaveAttribute("href", "#texting");
  const h2 = page.getByRole("heading", {
    name: "INFORMATION COLLECTED FOR TEXTING PROGRAM",
  });
  await expect.soft(h2).toBeVisible();
  await expect.soft(h2).toHaveId("texting");
  await expect.soft(page.getByText(textBody)).toBeVisible();
}
