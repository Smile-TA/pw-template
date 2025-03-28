const t = process.argv[2];

const utms = [
  "utm_content",
  // "utm_medium",
  // "utm_campaign",
  // "utm_source",
  // "utm_term",
  "gclid",
  "maclid",
];

const out = utms.reduce((acc, utm) => {
  switch (utm) {
    case "gclid":
      acc += `&${utm}=test_gclid_${t}`;
      break;
    case "maclid":
      acc += `&${utm}=test_maclid_${t}`;
      break;
    default:
      acc += `&${utm}=test_${utm.replace("_", `_${t}_`)}`;
  }
  return acc;
}, "");
console.log(`/?${out}`);

/*
/?utm_medium=test_cfe_medium&utm_campaign=test_cfe_campaign&utm_source=test_cfe_source&utm_content=test_cfe_content&utm_term=test_gfe_term&gclid=test_cfe_gclid&maclid=test_cfe_maclid

*/
