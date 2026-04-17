const fs = require("fs");
const path = require("path");

const PRODUCTS_FILE = path.join(__dirname, "products-source.json");
const CLICKS_FILE = path.join(__dirname, "data/clicks.json");

/**
 * 📦 LOAD PRODUCTS
 */
function loadProducts() {
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
}

/**
 * 📊 LOAD CLICK DATA
 */
function loadClicks() {
  if (!fs.existsSync(CLICKS_FILE)) return {};
  return JSON.parse(fs.readFileSync(CLICKS_FILE, "utf-8"));
}

/**
 * 🧠 APPLY SCORING
 */
function scoreProducts(products, clicks) {

  return products.map(p => {

    const score = clicks[p.asin] || 0;

    return {
      ...p,
      score
    };
  });
}

/**
 * 🚀 SORT BY PERFORMANCE
 */
function rank(products) {

  return products.sort((a, b) => b.score - a.score);
}

/**
 * 💾 SAVE BACK TO SOURCE (CRITICAL)
 */
function save(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

/**
 * 🚀 RUN OPTIMIZER
 */
function run() {

  console.log("\n📊 OPTIMIZING PRODUCT RANKING...\n");

  const products = loadProducts();
  const clicks = loadClicks();

  const scored = scoreProducts(products, clicks);
  const ranked = rank(scored);

  save(ranked);

  console.log("✅ PRODUCTS REORDERED BY PERFORMANCE");
}

run();
