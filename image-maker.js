const fs = require("fs");
const path = require("path");

/**
 * 📦 SOURCE DATA
 */
const SOURCE_FILE = path.join(__dirname, "products-source.json");
const OUTPUT_FILE = path.join(__dirname, "products-clean.json");

/**
 * 🧠 FALLBACK IMAGE (only used if missing)
 */
const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=No+Image+Available";

/**
 * 🔍 VALIDATION
 */
function isValidImage(img) {
  return typeof img === "string" && img.startsWith("http");
}

/**
 * 📦 LOAD PRODUCTS
 */
function loadProducts() {
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error("❌ Missing products-source.json");
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(SOURCE_FILE, "utf-8"));
}

/**
 * 🧼 FIX IMAGES (CORE FIX)
 */
function fixImages(products) {
  return products.map(p => {

    return {
      ...p,

      // 🔥 GUARANTEE IMAGE ALWAYS EXISTS
      image: isValidImage(p.image) ? p.image : FALLBACK_IMAGE
    };
  });
}

/**
 * 💾 SAVE CLEAN DATA
 */
function saveClean(data) {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log("✅ Image-fixed dataset created:", OUTPUT_FILE);
}

/**
 * 🚀 RUN
 */
function run() {
  console.log("🔧 Running image maker fix...");

  const products = loadProducts();
  const fixed = fixImages(products);

  saveClean(fixed);

  console.log("🏁 IMAGE FIX COMPLETE");
}

run();
