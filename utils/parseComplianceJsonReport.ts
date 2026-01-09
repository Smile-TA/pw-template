import { type Results } from "./complianceType";
import { stringify } from "csv-stringify/sync";
import fs from "fs";

if (!fs.existsSync("results.json"))
  throw new Error("results.json file not found");

const data = fs.readFileSync("results.json", "utf-8");

const dataObj = JSON.parse(data);

const typedData = dataObj as Results;

const processedArr = typedData.suites[0].suites?.map((suite) => {
  return {
    domain: suite.title.substring(5, suite.title.indexOf(" domain")),
    specs: suite.specs.map((spec) => {
      return { spec: spec.title, status: spec.tests[0].results[0].status };
    }),
  };
});

if (!processedArr) {
  throw new Error("No data to process");
}

const filteredArr = processedArr?.filter((domain) =>
  domain.specs.some((spec) => spec.status === "failed")
);

console.log(JSON.stringify(filteredArr, null, 2));

const outString = stringify(
  processedArr.map((o) => {
    return [o.domain, o.specs[0].status, o.specs[1].status, o.specs[2].status];
  }),
  {
    columns: ["domain", "cookie consent", "legal links", "gtm"],
    header: true,
  }
);

fs.writeFile("summaries/compliance-summary.csv", outString, (err: any) => {
  if (err) throw err;
  console.log("The csv compliance summary file has been saved!");
});
