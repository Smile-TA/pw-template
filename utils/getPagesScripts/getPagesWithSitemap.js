const Sitemapper = require("sitemapper");

const sitemap = new Sitemapper();
const baseUrl = process.argv[2];

sitemap.fetch(`${baseUrl}sitemap.xml`).then(function (res) {
  console.log("Total pages:", res.sites.length);
  res.sites.forEach((site, i, sites) => {
    sites[i] = site.replace(baseUrl, "");
  });
  res.sites.sort();
  console.log(JSON.stringify(res, null, "  "));
});
