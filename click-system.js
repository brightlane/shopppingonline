const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "data/clicks.json");

/**
 * 📦 LOAD CLICK DATA
 */
function load() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

/**
 * 💾 SAVE CLICK DATA
 */
function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/**
 * 🔥 TRACK CLICK (ASIN-BASED)
 */
function trackClick(asin) {

  if (!asin) return;

  const data = load();

  data[asin] = (data[asin] || 0) + 1;

  save(data);

  console.log("📊 Click tracked:", asin, data[asin]);
}

/**
 * 🧠 GET SCORE (FOR RANKING)
 */
function getScore(asin) {
  const data = load();
  return data[asin] || 0;
}

/**
 * 🚀 SORT PRODUCTS BY PERFORMANCE
 */
function rankProducts(products) {

  return products.sort((a, b) => {
    return getScore(b.asin) - getScore(a.asin);
  });
}

module.exports = {
  trackClick,
  getScore,
  rankProducts
};
