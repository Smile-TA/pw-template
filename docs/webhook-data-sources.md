# What this repo can send to the test-results webhook

Everything below comes from the custom reporters in `custom-reporters/`. They run in Playwright's
`onTestEnd` / `onEnd` hooks, so any field here can go in the webhook payload. Synthetic samples of
each output are in `docs/webhook-samples/`.

## Per test result: `test-results-csv-reporter.ts`
One row per test result. See `docs/webhook-samples/test-results.csv` and the `COLUMNS` list.

| Webhook field | Source column |
|---|---|
| test `id` | `reportLink` (`#?testId=...`, Playwright's stable test id) |
| test `name` | `title` |
| test `status` | `status` (`passed`/`failed`/`timedOut`/`skipped`/`interrupted`) |
| test `duration` | `durationMs` |
| test `error` | `error` (ANSI stripped, one line) |
| suite `name` / `file` | `project` / `file` |

Not in the current webhook spec, but available:
- `pagePath`, `pageUrl`: the page a check ran against (parsed from the test/suite title)
- `checkName`: the check without the page suffix
- `expectedStatus`: differs from `status` for `test.fail()` tests
- `failedStep`, `failedStepCategory`, `errorSnippet`, `errorStack`
- `tracePath`, `screenshotPath`, `videoPath`: relative to the published HTML report
- `tags`, `annotations`

## WCAG: `axe-summary-reporter.ts`
Each axe violation grouped by selector (`wcag-summary.json`), plus a flat one-row-per-violation
CSV. Fields: `url`, `target` (selector), `description`, `help`, `helpUrl`, `impact`
(`minor`/`moderate`/`serious`/`critical`), `testId` (links back to the test result above).

## Run level
Not produced by a reporter; CI supplies these as env vars: site hostname, base URL, deployed
version `tag`, `environment` (prod/staging), build number and URL, and the published report URL.
