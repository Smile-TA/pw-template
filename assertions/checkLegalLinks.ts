import { expect, type Page, test } from "@playwright/test";

export async function checkLegalLinks(page: Page) {
  await test.step("Privacy Policy links", async () => {
    const privacyPolicyLinks = await page
      .getByRole("link", { name: /Privacy Policy/i })
      .all();
    expect
      .soft(
        privacyPolicyLinks.length,
        "Links with text Privacy Policy are missing"
      )
      .toBeGreaterThan(0);
    for (const ppl of privacyPolicyLinks) {
      await expect
        .soft(ppl, "Privacy Policy link address is not correct")
        .toHaveAttribute("href", "https://integrity.com/privacy-policy");
    }
  });

  //   await test.step("Terms of Service links", async () => {
  //     // Terms of Use, Terms of Service, Terms & Conditions
  //     const termsLinks = await page.getByText("Terms of Use").all();
  //     for (const tl of termsLinks) {
  //       await expect
  //         .soft(tl)
  //         .toHaveAttribute("href", "https://integrity.com/terms-of-service/");
  //     }
  //   });

  // await test.step("Consumer Health Data Privacy Notice links", async () => {
  //   const consumerLinks = await page
  //     .getByText("Consumer Health Data Privacy Notice")
  //     .all();
  //   for (const cl of consumerLinks) {
  //     await expect
  //       .soft(cl)
  //       .toHaveAttribute(
  //         "href",
  //         "https://integrity.com/consumer-health-data-privacy-notice/"
  //       );
  //   }
  // });

  await test.step("Do Not Sell or Share My Personal Information links", async () => {
    const doNotSellLinks = await page
      .locator("a[href^='https://submit-irm.trustarc.com/']")
      .all();
    expect
      .soft(
        doNotSellLinks.length,
        "Links with text Do Not Sell or Share My Personal Information are missing"
      )
      .toBeGreaterThan(0);
    for (const dnl of doNotSellLinks) {
      await expect
        .soft(
          dnl,
          "Do Not Sell or Share My Personal Information link text is not correct"
        )
        .toContainText("Do Not Sell or Share My Personal Information");
    }
  });
}
