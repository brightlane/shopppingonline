const fs = require("fs");

const FILE = "products-source.json";

function run() {

  const products = JSON.parse(fs.readFileSync(FILE, "utf-8"));

  const map = {};

  products.forEach(p => {
    if (!map[p.asin]) map[p.asin] = [];
    map[p.asin].push(p.title);
  });

  console.log("\n🔍 ASIN DISTRIBUTION:\n");

  Object.keys(map).forEach(asin => {
    console.log(`ASIN: ${asin}`);
    console.log("Products:", map[asin].length);

    if (map[asin].length > 1) {
      console.log("⚠️ DUPLICATE ASIN USED BY:");
      map[asin].forEach(t => console.log(" -", t));
    }

    console.log("----------------------");
  });
}

run();
