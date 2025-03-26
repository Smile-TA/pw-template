const fs = require("node:fs");
const url = process.argv[2] ?? "NONE";

fs.readFile(".env", "utf8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  const d = data
    .split("\n")
    .map((line) => (line.indexOf("BASE_URL") === 0 ? `# ${line}` : line));
  d.unshift(`BASE_URL=${url}`);
  const out = d.join("\n");
  fs.writeFile(".env", out, (err) => {
    console.log(err);
  });
});
