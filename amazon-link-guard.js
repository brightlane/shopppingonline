const fs = require("fs");
const path = require("path");

/**
 * 📦 INPUT / OUTPUT
 */
const INPUT_FILE = path.join(__dirname, "products-clean.json");
const OUTPUT_FILE = path.join(__dirname, "products-final.json");

/**
 * 🔥 AFFILIATE TAG (your tracking ID)
 */
const AFFILIATE_TAG = "brightlane201-20";

/**
 * 🧠 VALID ASIN CHECK
 */
function isValidASIN(asin) {
  return typeof asin === "string" && /^[A-Z0-9]{10}$/.test(asin);
}

/**
 * 🔗 BUILD SAFE AMAZON LINK
 */
function buildAmazonLink(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

/**
 * 📦 LOAD PRODUCTS
 */
function loadProducts() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error("❌ Missing products-clean.json");
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(INPUT_FILE, "utf-8"));
}

/**
 * 🧹 FILTER + FIX PRODUCTS
 */
function guardProducts(products) {
  const clean = [];

  products.forEach(p => {

    // ❌ BLOCK INVALID ASIN
    if (!isValidASIN(p.asin)) {
      console.log("❌ Removed invalid ASIN:", p.asin);
      return;
    }

    // ❌ BLOCK EMPTY TITLE
    if (!p.title) {
      console.log("❌ Removed missing title:", p.asin);
      return;
    }

    // 🔥 FORCE CORRECT AMAZON LINK
    p.amazonLink = buildAmazonLink(p.asin);

    clean.push(p);
  });

  return clean;
}

/**
 * 💾 SAVE FINAL DATASET
 */
function save(data) {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log("✅ Amazon-safe dataset created:", OUTPUT_FILE);
}

/**
 * 🚀 RUN
 */
function run() {
  console.log("🔐 Running Amazon link guard...");

  const products = loadProducts();
  const safe = guardProducts(products);

  save(safe);

  console.log("🏁 AMAZON GUARD COMPLETE");
}

run();
