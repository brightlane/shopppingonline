const fs = require("fs");
const path = require("path");

/**
 * 🔥 AFFILIATE CONFIG
 */
const AFFILIATE_TAG = "brightlane201-20";

/**
 * 🧠 RAW PRODUCT DATA (replace or import from JSON later)
 */
let products = [
  {
    asin: "B08K2S1S2R",
    title: "Dyson V11 Cordless Vacuum",
    image: "https://m.media-amazon.com/images/I/71V--WZVUIL._AC_SL1500_.jpg",
    category: "vacuum"
  },
  {
    asin: "INVALID123", // ❌ this will be removed
    title: "Broken Product Example",
    image: "",
    category: "vacuum"
  },
  {
    asin: "B07FNKNFJ9",
    title: "Breville Coffee Machine",
    image: "https://m.media-amazon.com/images/I/61i8v3+K7dL._AC_SL1500_.jpg",
    category: "coffee"
  }
];

/**
 * 🔒 VALIDATION RULES
 */
function isValidASIN(asin) {
  return typeof asin === "string" && /^[A-Z0-9]{10}$/.test(asin);
}

function hasValidImage(image) {
  return typeof image === "string" && image.startsWith("http");
}

/**
 * 🚨 CLEAN PRODUCTS (CORE FIX)
 */
function validateProducts(list) {
  const cleaned = [];

  list.forEach(p => {
    if (!isValidASIN(p.asin)) {
      console.log("❌ Removed invalid ASIN:", p.asin);
      return;
    }

    if (!p.title || p.title.length < 3) {
      console.log("❌ Removed missing title:", p.asin);
      return;
    }

    if (!hasValidImage(p.image)) {
      console.log("⚠️ Missing image (allowed but fallback applied):", p.asin);
      p.image =
        "https://via.placeholder.com/600x400?text=No+Image+Available";
    }

    cleaned.push(p);
  });

  return cleaned;
}

/**
 * 🔗 AMAZON LINK BUILDER
 */
function amazonLink(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

/**
 * 📦 SAVE CLEAN DATA FOR GENERATOR
 */
function saveCleanProducts(cleaned) {
  const outputPath = path.join(__dirname, "products-clean.json");

  fs.writeFileSync(outputPath, JSON.stringify(cleaned, null, 2), "utf-8");

  console.log("✅ Clean product file created:", outputPath);
}

/**
 * 🚀 RUN VALIDATION PIPELINE
 */
function run() {
  console.log("🔍 Running product validation...");

  const cleaned = validateProducts(products);

  console.log(`✅ Valid products: ${cleaned.length}`);
  console.log(`❌ Removed products: ${products.length - cleaned.length}`);

  saveCleanProducts(cleaned);
}

run();
