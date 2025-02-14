import { expect, type Page } from "@playwright/test";

const months = [
  "January",
  "February",
  "April",
  "March",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
/*
Formats found: 
Last Updated: 9/6/2023 -> https://easystreetins.com/privacy-policy/
Last Updated: 8.21.2023 -> https://pennglobalmarketing.staging02.imgwebhost.com/privacy-policy/
Last Updated: October 25, 2023 -> seems to be most common. We will be enforcing this format. 
This Notice is effective October 19, 2020. -> https://premiersmi.staging.imgwebhost.com/privacy-notice/
Last Updated: August, 2023 -> https://planyourfuture.biz/
*/

export async function checkLastUpdated(page: Page) {
  const lastUpdated = page.getByText("Last Updated");
  const dateText = await page
    .locator("p", { has: lastUpdated })
    .or(page.locator("div", { has: lastUpdated }))
    .allInnerTexts();
  let unformattedDate = "";
  for (const month of months) {
    const i = dateText[0].indexOf(month);
    if (i > 0) {
      unformattedDate = dateText[0].slice(i);
      break;
    }
  }
  const cutOffDate = new Date("May 1, 2023");
  const date = new Date();
  const [month, day, year] = unformattedDate.split(" ");
  date.setHours(0, 0, 0);
  date.setMonth(months.indexOf(month));
  date.setDate(Number(day.replace(/,$/, "")));
  date.setFullYear(Number(year.trim().slice(0, 4)));
  expect
    .soft(
      date.getTime(),
      `Last updated date of ${date.toDateString()} should be later than the cut off date of ${cutOffDate.toDateString()}`
    )
    .toBeGreaterThan(cutOffDate.getTime());
}
