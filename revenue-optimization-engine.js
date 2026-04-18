/**
 * revenue-optimization-engine.js
 * AAC Revenue Intelligence Layer
 * Optimizes product ranking based on estimated revenue potential (not just CTR)
 */

const fs = require("fs");
const path = require("path");

// === CONFIG ===
const DATA_FILE = path.join(__dirname, "cache/revenue-data.json");

// === ENTRY POINT ===
function runRevenueEngine() {
  console.log("💰 Running Revenue Optimization Engine...");

  const data = loadData();

  const optimized = optimizeRevenue(data);

  saveData(optimized);

  console.log("✅ Revenue optimization complete");
}

// === LOAD DATA ===
function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return {
        products: {}
      };
    }

    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (err) {
    return {
      products: {}
    };
  }
}

// === CORE REVENUE OPTIMIZATION ===
function optimizeRevenue(data) {
  const products = data.products || {};

  Object.keys(products).forEach(id => {
    const p = products[id];

    const ctr = safeDivide(p.clicks, p.impressions);
    const conversion = safeDivide(p.sales, p.clicks);
    const avgOrderValue = p.aov || 0;

    const revenuePerImpression =
      ctr * conversion * avgOrderValue;

    // === NEW SCORE MODEL (REVENUE FIRST) ===
    p.revenueScore = revenuePerImpression * 100;

    // === STRATEGIC FLAGS ===
    p.priority =
      p.revenueScore > 5 ? "HIGH_REVENUE" :
      p.revenueScore > 2 ? "MID_REVENUE" : "LOW_REVENUE";

    // === AUTO OPTIMIZATION SIGNALS ===
    p.boostRanking = p.revenueScore > 3;
    p.demoteRanking = p.revenueScore < 1;
  });

  return data;
}

// === SAFE DIVISION ===
function safeDivide(a, b) {
  if (!a || !b) return 0;
  return a / b;
}

// === SAVE DATA ===
function saveData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// === EXPORTS ===
module.exports = {
  runRevenueEngine
};

// === AUTO RUN ===
if (require.main === module) {
  runRevenueEngine();
}
