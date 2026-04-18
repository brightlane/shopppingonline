/**
 * closed-loop-learning-engine.js
 * AAC Closed Feedback Learning System
 * Converts outcomes into persistent system improvements
 */

const fs = require("fs");
const path = require("path");

// === CONFIG ===
const HISTORY_FILE = path.join(__dirname, "cache/learning-history.json");
const POLICY_FILE = path.join(__dirname, "cache/system-policy.json");

// === LOAD HISTORY ===
function loadHistory() {
  try {
    if (!fs.existsSync(HISTORY_FILE)) {
      return [];
    }

    return JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8"));
  } catch (e) {
    return [];
  }
}

// === LOAD POLICY ===
function loadPolicy() {
  try {
    if (!fs.existsSync(POLICY_FILE)) {
      return {
        seoWeight: 1.0,
        revenueWeight: 1.0,
        trafficWeight: 1.0
      };
    }

    return JSON.parse(fs.readFileSync(POLICY_FILE, "utf8"));
  } catch (e) {
    return {
      seoWeight: 1.0,
      revenueWeight: 1.0,
      trafficWeight: 1.0
    };
  }
}

// === SAVE POLICY ===
function savePolicy(policy) {
  fs.mkdirSync(path.dirname(POLICY_FILE), { recursive: true });

  fs.writeFileSync(POLICY_FILE, JSON.stringify(policy, null, 2));
}

// === RECORD OUTCOME ===
function recordOutcome(outcome) {
  /**
   * outcome example:
   * {
   *   action: "SEO_BOOST",
   *   seoResult: +1 | -1,
   *   revenueResult: +1 | -1,
   *   trafficResult: +1 | -1
   * }
   */

  const history = loadHistory();

  history.push({
    ...outcome,
    timestamp: Date.now()
  });

  if (history.length > 1000) {
    history.shift();
  }

  fs.mkdirSync(path.dirname(HISTORY_FILE), { recursive: true });

  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));

  updatePolicy(history);
}

// === CORE LEARNING FUNCTION ===
function updatePolicy(history) {
  const policy = loadPolicy();

  const recent = history.slice(-50);

  let seoImpact = 0;
  let revenueImpact = 0;
  let trafficImpact = 0;

  recent.forEach(h => {
    seoImpact += h.seoResult || 0;
    revenueImpact += h.revenueResult || 0;
    trafficImpact += h.trafficResult || 0;
  });

  const total = recent.length || 1;

  const seoAvg = seoImpact / total;
  const revenueAvg = revenueImpact / total;
  const trafficAvg = trafficImpact / total;

  // === ADJUST POLICY WEIGHTS ===

  policy.seoWeight += seoAvg * 0.05;
  policy.revenueWeight += revenueAvg * 0.05;
  policy.trafficWeight += trafficAvg * 0.05;

  // === CLAMP VALUES ===
  policy.seoWeight = clamp(policy.seoWeight);
  policy.revenueWeight = clamp(policy.revenueWeight);
  policy.trafficWeight = clamp(policy.trafficWeight);

  savePolicy(policy);
}

// === CLAMP FUNCTION ===
function clamp(value) {
  if (value < 0.2) return 0.2;
  if (value > 3.0) return 3.0;
  return value;
}

// === GET CURRENT POLICY ===
function getPolicy() {
  return loadPolicy();
}

// === EXPORTS ===
module.exports = {
  recordOutcome,
  getPolicy
};

// === TEST RUN ===
if (require.main === module) {
  console.log("🔁 Running Closed Loop Learning Engine...");

  recordOutcome({
    action: "SEO_BOOST",
    seoResult: 1,
    revenueResult: 1,
    trafficResult: 0
  });

  console.log("Current Policy:", getPolicy());
}
