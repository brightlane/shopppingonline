const fs = require("fs");
const path = require("path");

/**
 * 🔥 FILES
 */
const SOURCE = path.join(__dirname, "products-source.json");
const CLEAN = path.join(__dirname, "products-clean.json");

/**
 * 🧠 RULES
 */
function isASIN(v) {
  return typeof v === "string" && /^[A-Z0-9]{10}$/.test(v);
}

function safeImage(img) {
  if (typeof img === "string" && img.startsWith("http")) return img;
  return "https://via.placeholder.com/600x400?text=No+Image";
}

/**
 * 📦 LOAD DATA
 */
function load() {
  if (!fs.existsSync(SOURCE)) return [];

  return JSON.parse(fs.readFileSync(SOURCE, "utf-8"));
}

/**
 * 🧹 CLEAN + ENRICH DATA
 */
function process(products) {
  const map = [];

  products.forEach(p => {
    if (!isASIN(p.asin)) {
      console.log("❌ Removed invalid ASIN:", p.asin);
      return;
    }

    if (!p.title) return;

    map.push({
      asin: p.asin,
      title: p.title,
      category: p.category || "general",
      image: safeImage(p.image),

      // 🧠 AUTO ENRICHMENT LAYER
      url: `https://www.amazon.com/dp/${p.asin}`,
      affiliate: `https://www.amazon.com/dp/${p.asin}?tag=brightlane201-20`
    });
  });

  return map;
}

/**
 * 💾 SAVE CLEAN DATASET
 */
function save(data) {
  fs.writeFileSync(CLEAN, JSON.stringify(data, null, 2));
  console.log("✅ Clean dataset saved");
}

/**
 * 🧠 AUTO CATEGORY INDEX
 */
function buildIndex(products) {
  const index = {};

  products.forEach(p => {
    if (!index[p.category]) index[p.category] = [];
    index[p.category].push(p);
  });

  const file = path.join(__dirname, "category-index.json");
  fs.writeFileSync(file, JSON.stringify(index, null, 2));

  console.log("📚 Category index built");
}

/**
 * 🚀 RUN PIPELINE
 */
function run() {
  console.log("🚀 AUTOPILOT START");

  const raw = load();
  console.log("📦 Loaded:", raw.length);

  const clean = process(raw);

  console.log("✅ Valid:", clean.length);
  console.log("❌ Removed:", raw.length - clean.length);

  save(clean);
  buildIndex(clean);

  console.log("🏁 AUTOPILOT COMPLETE");
}

run();
