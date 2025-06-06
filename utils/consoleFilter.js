/**
 * Paste the commands below to outline or hide tests by test name
 *
 */

// Exclude by title text and highlight red all other
function outlineChipWithText(t) {
  [
    ...document.querySelectorAll(
      ".test-file-test.test-file-test-outcome-unexpected"
    ),
  ]
    .map((e) => e.querySelector(".test-file-title"))
    .filter((e) => !e.innerText.includes(t))
    .forEach((e) => (e.style = "border: 1px solid red"));
}
outlineChipWithText("Check skip link");

// Hide elements based on text
function hideTextInChip(text) {
  [
    ...document.querySelectorAll(
      ".test-file-test.test-file-test-outcome-unexpected"
    ),
  ]
    .map((e) => e.querySelector(".test-file-title"))
    .filter((e) => e.innerText.includes(text))
    .forEach((e) => (e.hidden = true));
}
hideTextInChip("Check Skip Link");

function extractLinks(baseUrl) {
  return [
    ...$$(
      "div.test-file-test.test-file-test-outcome-unexpected div.hbox a[title]"
    ),
  ]
    .map((e) => e.innerText)
    .map((s) => s.substring(s.indexOf("test ") + 5, s.indexOf(" page ›")))
    .map((s) => (s === "Home" ? "/" : s))
    .map((s) => baseUrl + s);
}
