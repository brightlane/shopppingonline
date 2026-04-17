const fs = require("fs");
const path = require("path");

/**
 * 🔥 CONFIG
 */
const SOURCE_FILE = path.join(__dirname, "products-source.json");
const CLEAN_FILE = path.join(__dirname, "products-clean.json");

/**
 * 🧠 VALIDATION RULES
 */
function isValidASIN(asin) {
  return typeof asin === "string" && /^[A-Z0-9]{10}$/.test(asin);
}

function isValidImage(img) {
  return typeof img === "string" && img.startsWith("http");
}

/**
 * 📦 LOAD SOURCE DATA
 */
function loadSource() {
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error("❌ Missing products-source.json");
    process.exit(1);
  }

  const raw = fs.readFileSync(SOURCE_FILE, "utf-8");
  return JSON.parse(raw);
}

/**
 * 🧹 CLEAN + VALIDATE PRODUCTS
 */
function cleanProducts(products) {
  const clean = [];

  products.forEach(p => {
    if (!isValidASIN(p.asin)) {
      console.log("❌ Removed invalid ASIN:", p.asin);
      return;
    }

    if (!p.title || p.title.length < 3) {
      console.log("❌ Removed missing title:", p.asin);
      return;
    }

    if (!isValidImage(p.image)) {
      console.log("⚠️ Missing image → fallback applied:", p.asin);
      p.image =
        "https://via.placeholder.com/600x400?text=Product+Image";
    }

    if (!p.category) {
      p.category = "uncategorized";
    }

    clean.push(p);
  });

  return clean;
}

/**
 * 💾 SAVE CLEAN DATA
 */
function saveClean(data) {
  fs.writeFileSync(CLEAN_FILE, JSON.stringify(data, null, 2));
  console.log("✅ Clean dataset saved:", CLEAN_FILE);
}

/**
 * 🚀 OPTIONAL HOOKS (for your generators)
 */
function triggerGenerators() {
  console.log("🚀 You can now run:");
  console.log("   node product-generator.js");
  console.log("   node internal-linker.js");
  console.log("   node seo-silo-builder.js");
}

/**
 * 🔥 RUN PIPELINE
 */
function run() {
  console.log("🔍 Starting auto data pipeline...");

  const source = loadSource();
  console.log(`📦 Loaded: ${source.length} products`);

  const clean = cleanProducts(source);

  console.log(`✅ Valid: ${clean.length}`);
  console.log(`❌ Removed: ${source.length - clean.length}`);

  saveClean(clean);
  triggerGenerators();

  console.log("🏁 PIPELINE COMPLETE");
}

run();
