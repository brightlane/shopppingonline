const fs = require("fs");
const path = require("path");

const PRODUCTS_FILE = path.join(__dirname, "products-source.json");

const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=Product+Image";

function load() {
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
}

/**
 * 🧠 VALID ASIN CHECK (basic safety)
 */
function isValidASIN(asin) {
  return typeof asin === "string" && asin.length >= 8;
}

/**
 * 🖼 IMAGE GUARANTEE
 */
function fixImage(p) {
  if (!p.image || p.image.includes("undefined") || p.image === "") {
    return FALLBACK_IMAGE;
  }
  return p.image;
}

/**
 * 🔗 AMAZON LINK GUARANTEE
 */
function buildAmazonLink(asin, tag = "brightlane201-20") {
  if (!isValidASIN(asin)) return "#";
  return `https://www.amazon.com/dp/${asin}?tag=${tag}`;
}

/**
 * 🚀 CLEAN ALL PRODUCTS
 */
function sanitize(products) {
  return products.map(p => {
    return {
      ...p,

      // enforce safe image
      image: fixImage(p),

      // enforce valid link only if ASIN exists
      link: buildAmazonLink(p.asin),

      // safety flag
      valid: isValidASIN(p.asin)
    };
  });
}

/**
 * 💾 SAVE CLEAN DATA
 */
function run() {
  const products = load();
  const cleaned = sanitize(products);

  fs.writeFileSync(
    PRODUCTS_FILE,
    JSON.stringify(cleaned, null, 2)
  );

  console.log("✅ PRODUCT SANITY COMPLETE — ALL DATA FIXED");
}

run();
