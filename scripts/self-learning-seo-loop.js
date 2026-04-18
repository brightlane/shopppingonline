/**
 * self-learning-seo-loop.js
 * AAC Self-Improving SEO Intelligence Layer
 * Uses performance feedback to adjust rankings + content priority
 */

const fs = require("fs");
const path = require("path");

// === DATA STORAGE (simple local learning layer) ===
const DATA_FILE = path.join(__dirname, "../cache/seo-learning.json");

// === MAIN ENTRY ===
function runLearningLoop() {
  console.log("🧠 Running Self-Learning SEO Loop...");

  const data = loadData();

  const updated = processLearning(data);

  saveData(updated);

  console.log("✅ Learning loop complete");
}

// === LOAD HISTORY ===
function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return {
        pages: {},
        globalSignals: {}
      };
    }

    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (err) {
    return {
      pages: {},
      globalSignals: {}
    };
  }
}

// === CORE LEARNING ENGINE ===
function processLearning(data) {
  const pages = data.pages || {};

  Object.keys(pages).forEach(pageId => {
    const page = pages[pageId];

    const ctr = calculateCTR(page);
    const decay = calculateDecay(page);

    // === ADJUST SCORE ===
    page.score = (page.score || 1)
      + ctrBoost(ctr)
      - decayPenalty(decay);

    // === SELF-HEAL SIGNALS ===
    page.needsRewrite = ctr < 0.02 || decay > 0.6;

    // === TAGGING FOR REBUILD ENGINE ===
    page.priority =
      page.score > 5 ? "high" :
      page.score > 2 ? "medium" : "low";
  });

  return data;
}

// === CTR CALCULATION ===
function calculateCTR(page) {
  if (!page.impressions) return 0;
  return (page.clicks || 0) / page.impressions;
}

// === CONTENT DECAY MODEL ===
function calculateDecay(page) {
  const age = page.ageDays || 1;
  const engagement = page.engagement || 1;

  return Math.min(1, age / (engagement + 5));
}

// === SCORE BOOST LOGIC ===
function ctrBoost(ctr) {
  if (ctr > 0.08) return 2;
  if (ctr > 0.04) return 1;
  if (ctr > 0.02) return 0.5;
  return -0.5;
}

// === DECAY PENALTY ===
function decayPenalty(decay) {
  return decay * 1.5;
}

// === SIMULATED EVENT INGEST (from tracker.js future hook) ===
function ingestEvent(pageId, eventType) {
  const data = loadData();

  if (!data.pages[pageId]) {
    data.pages[pageId] = {
      clicks: 0,
      impressions: 0,
      score: 1,
      ageDays: 1
    };
  }

  const page = data.pages[pageId];

  if (eventType === "click") page.clicks++;
  if (eventType === "impression") page.impressions++;

  saveData(data);
}

// === SAVE DATA ===
function saveData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// === EXPORTS ===
module.exports = {
  runLearningLoop,
  ingestEvent
};

// === AUTO RUN ===
if (require.main === module) {
  runLearningLoop();
}
