/**
 * conversion-attribution-engine.js
 * AAC Conversion Intelligence Layer
 * Tracks which traffic sources generate actual revenue
 */

const fs = require("fs");
const path = require("path");

// === CONFIG ===
const DATA_FILE = path.join(__dirname, "cache/attribution-data.json");

// === ENTRY POINT ===
function runAttributionEngine() {
  console.log("📊 Running Conversion Attribution Engine...");

  const data = loadData();

  const updated = processAttribution(data);

  saveData(updated);

  console.log("✅ Attribution processing complete");
}

// === LOAD DATA ===
function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return {
        sources: {}
      };
    }

    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (err) {
    return {
      sources: {}
    };
  }
}

// === CORE ATTRIBUTION LOGIC ===
function processAttribution(data) {
  const sources = data.sources || {};

  Object.keys(sources).forEach(sourceId => {
    const s = sources[sourceId];

    const revenue = s.revenue || 0;
    const clicks = s.clicks || 0;
    const visits = s.visits || 0;

    // === CORE METRICS ===
    const ctr = safeDivide(clicks, visits);
    const epc = safeDivide(revenue, clicks); // earnings per click
    const rpm = safeDivide(revenue, visits) * 1000; // revenue per 1000 visits

    // === FINAL VALUE SCORE ===
    const valueScore =
      (epc * 2) +
      (rpm * 0.5) +
      (ctr * 10);

    s.metrics = {
      ctr,
      epc,
      rpm,
      valueScore
    };

    // === STRATEGIC DECISION FLAGS ===
    s.strategy =
      valueScore > 5 ? "SCALE" :
      valueScore > 2 ? "MAINTAIN" : "CUT";

    s.priority =
      s.strategy === "SCALE" ? 1 :
      s.strategy === "MAINTAIN" ? 2 : 3;
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
  runAttributionEngine
};

// === AUTO RUN ===
if (require.main === module) {
  runAttributionEngine();
}
