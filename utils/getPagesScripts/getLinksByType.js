const axios = require("axios");

// TODO: convert to TS, and convert to a pre-script to dynamically write to the pages file

async function getPageLinks(baseUrl, postType) {
  try {
    const res = await axios.get(`${baseUrl}/wp-json/wp/v2/${postType}`);
    const wpTotal = res.headers["x-wp-total"] ?? "PAGE TOTAL IS UNKNOWN";
    const wpTotalPages =
      res.headers["x-wp-totalpages"] ?? "PAGE TOTAL IS UNKNOWN";
    console.log(`Total pages: ${wpTotal}`);
    const promises = [];
    for (let i = 1; i <= wpTotalPages; i++) {
      promises.push(axios.get(`${baseUrl}wp-json/wp/v2/${postType}?page=${i}`));
    }
    const pages = await Promise.all(promises);
    const links = pages
      .map((p) => p.data)
      .reduce((acc, p) => {
        if (typeof p === "string") {
          let parsed = JSON.parse(p.substring(p.indexOf("[")));
          return [
            ...acc,
            ...parsed.map((pageObject) =>
              pageObject.link.replace(baseUrl, "/")
            ),
          ];
        }
        return [
          ...acc,
          ...p.map((pageObject) => pageObject.link.replace(baseUrl, "/")),
        ];
      }, []);
    links.sort();
    console.log(JSON.stringify(links, null, "  "));
    return links;
  } catch (error) {
    console.error(error.message);
    process.exit(error.statusCode);
  }
}

if (require.main === module) {
  const baseUrl = process.argv[2];
  const postType = process.argv[3] ?? "pages";
  getPageLinks(baseUrl, postType);
}

module.exports = {
  getPageLinks,
};
