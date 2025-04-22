# Playwright Test Automation Template

## Install

```sh
# Node version v23.10.0
npm install
```

## Setup

1. Create a `.env` file from the `example.env` file.
2. Add the environment variables into the `.env` file. 
    - BASE_URL (Required), base url of website under test. 
3. Run `node utils/generatePagesFile.js` to get public pages of the website and generate `pages.ts` file

## Run
```sh
# Runs the e2e test suite
npm run test:e2e

# Runs the auth e2e test suit. Don't forget to add the TEST_USR_* variables into the .env file!
npm run test -- --project e2e-auth
```

### Quickstart
```sh
cp example.env .env
node utils/addBaseUrl.js REPLACE_WITH_TARGET_URL && node utils/generatePagesFile.js && npm run test:e2e
```


## List of test cases

### E2E Project

- Each page should have a favicon link
- Each page should have only one h1 
- Check each page for placeholder text such as:
    - Lorem Ipsum
    - [Insert Company Party Name] in the footer
    - [agency/producer] in the footer
    - Hello World! 
- All Outbound links should open in a new tab. 
- Check Last Updated date on Privacy Policy page
- Check Texting info section on Privacy Policy page
- Robots meta tag should have "noindex, nofollow" on staging, and it should not "noindex, nofollow" that on prod. 
- Each page should pass AXE WCAG test suite
- Check that skip link is present and implemented to set standards.
- Check that tel links match tel href
- Check that staging links do not exist on prod
- Check that console errors do not exist
- Check for image file sizes

Tested only on prod:

- Each page should have a correct GTM
- Pages should have SEO meta tag
- Verify correct admin email. (Requires ADMIN_USR_NAME and ADMIN_USR_PSW in the .env file.)

### Cross Browser VRT Project

- Compare visual differences across browsers

### Nav Visibility Project

- Given a breakpoint and two selectors, verify that navigation is visible at all screen sizes

### Compliance Project

- Given routes to compliance pages, verify the content is correct

## References

https://playwright.dev/docs/intro

## Questions and Suggestions

Contact Smile from QA at smile.bestybay@thomasarts.com