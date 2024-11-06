const axios = require("axios");

const baseUrl = process.argv[2];

async function getPostTypes() {
  const res = await axios.get(`${baseUrl}/wp-json/wp/v2/types`);
  console.log(Object.keys(res.data));
}

getPostTypes();
