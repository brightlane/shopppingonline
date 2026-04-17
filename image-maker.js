const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "products-source.json");
const OUTPUT = path.join(__dirname, "products-final.json");

/**
 * 🔥 GUARANTEED FALLBACK IMAGE
 */
const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=No+Image+Available";

/**
 * 🧠 VALID IMAGE CHECK
 */
function isValidImage(img) {
  return typeof img === "string" && img.startsWith("http");
}

/**
 * 📦 LOAD SOURCE
 */
function load() {
  return JSON.parse(fs.readFileSync(INPUT, "utf-8"));
}

/**
 * 🔧 GUARANTEE IMAGE EXISTS (CORE FIX)
 */
function enforceImages(products) {
  return products.map(p => ({
    ...p,

    // 🔥 GUARANTEE RULE
    image: isValidImage(p.image) ? p.image : FALLBACK_IMAGE
  }));
}

/**
 * 💾 SAVE FINAL OUTPUT
 */
function save(data) {
  fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2));
  console.log("✅ products-final.json now GUARANTEED with images");
}

/**
 * 🚀 RUN
 */
function run() {
  console.log("🔧 enforcing image guarantees...");

  const products = load();
  const fixed = enforceImages(products);

  save(fixed);

  console.log("🏁 DONE - every product now has image");
}

run();
