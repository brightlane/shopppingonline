const fs = require("fs");

const FILE = "./products-source.json";

function isValidASIN(asin) {
  return typeof asin === "string" && /^[A-Z0-9]{8,12}$/.test(asin);
}

function scan() {
  const raw = fs.readFileSync(FILE, "utf-8");
  const products = JSON.parse(raw);

  console.log("\n🔍 PRODUCT DATA SCAN START\n");

  let issues = {
    missingAsin: 0,
    invalidAsin: 0,
    missingImage: 0,
    badUrlFields: 0,
    duplicates: {}
  };

  products.forEach((p, i) => {

    // ASIN CHECK
    if (!p.asin) {
      issues.missingAsin++;
      console.log(`❌ [${i}] Missing ASIN - ${p.title}`);
    } else if (!isValidASIN(p.asin)) {
      issues.invalidAsin++;
      console.log(`⚠️ [${i}] Invalid ASIN (${p.asin}) - ${p.title}`);
    }

    // IMAGE CHECK
    if (!p.image || p.image.includes("undefined")) {
      issues.missingImage++;
      console.log(`🖼️ [${i}] Missing image - ${p.title}`);
    }

    // URL FIELD CHECK (THIS IS CRITICAL FOR YOUR BUG)
    if (p.link && p.link.includes("amazon.com/dp/")) {
      if (p.link.includes("amazon.com/dp/amazon.com")) {
        issues.badUrlFields++;
        console.log(`🚨 [${i}] BROKEN DUPLICATED URL - ${p.title}`);
      }
    }

    // DUPLICATE ASIN CHECK
    if (p.asin) {
      issues.duplicates[p.asin] = (issues.duplicates[p.asin] || 0) + 1;
    }
  });

  console.log("\n📊 SUMMARY\n");
  console.log("Missing ASIN:", issues.missingAsin);
  console.log("Invalid ASIN:", issues.invalidAsin);
  console.log("Missing Image:", issues.missingImage);
  console.log("Broken URLs:", issues.badUrlFields);

  console.log("\n🔁 DUPLICATE ASINs:\n");

  Object.entries(issues.duplicates).forEach(([asin, count]) => {
    if (count > 1) {
      console.log(`⚠️ ${asin} used ${count} times`);
    }
  });

  console.log("\n✅ SCAN COMPLETE\n");
}

scan();
