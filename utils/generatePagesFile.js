const fs = require("node:fs");
const { getPageLinks } = require("./getPagesScripts/getLinksByType");
const dotenv = require("dotenv");
dotenv.config();
const url = process.env.BASE_URL;
if (url === "undefined") {
  throw Error("Missing base url");
} else if (url.includes("planenroll")) {
  fs.writeFile("./pages.ts", 'export const pages = ["/", "/thanks"];', (e) =>
    console.log(e)
  );
} else {
  getPageLinks(url, "pages").then((res) =>
    fs.writeFile(
      "./pages.ts",
      `export const pages = ${JSON.stringify(res)}`,
      (e) => console.log(e)
    )
  );
}
