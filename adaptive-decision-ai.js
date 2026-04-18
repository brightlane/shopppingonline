/**
 * adaptive-decision-ai.js
 * AAC Adaptive Decision Layer
 * Learns from system outcomes and adjusts decision weights over time
 */

const fs = require("fs");
const path = require("path");

// === CONFIG ===
const WEIGHTS_FILE = path.join(__dirname, "cache/decision-weights.json");

// === DEFAULT WEIGHTS ===
function getDefaultWeights() {
  return {
    seo: 1.0,
    revenue: 1.5,
    traffic: 1.2,
    stability: 1.0
  };
}

// === LOAD WEIGHTS ===
function loadWeights() {
  try {
    if (!fs.existsSync(WEIGHTS_FILE)) {
      return getDefaultWeights();
    }

    return JSON.parse(fs.readFileSync(WEIGHTS_FILE, "utf8"));
  } catch (e) {
    return getDefaultWeights();
  }
}

// === SAVE WEIGHTS ===
function saveWeights(weights) {
  fs.mkdirSync(path.dirname(WEIGHTS_FILE), { recursive: true });
  fs.writeFileSync(WEIGHTS_FILE, JSON.stringify(weights, null, 2));
}

// === CORE DECISION SCORE ENGINE ===
function calculateDecisionScore(metrics, weights) {
  return (
    (metrics.seo || 0) * weights.seo +
    (metrics.revenue || 0) * weights.revenue +
    (metrics.traffic || 0) * weights.traffic +
    (metrics.stability || 0) * weights.stability
  );
}

// === LEARNING UPDATE FUNCTION ===
function updateWeightsFromOutcome(outcome) {
  const weights = loadWeights();

  /**
   * Outcome example:
   * {
   *   seoImpact: +1 / -1,
   *   revenueImpact: +1 / -1,
   *   trafficImpact: +1 / -1
   * }
   */

  if (outcome.revenueImpact > 0) {
    weights.revenue += 0.05;
  } else {
    weights.revenue -= 0.03;
  }

  if (outcome.seoImpact > 0) {
    weights.seo += 0.03;
  } else {
    weights.seo -= 0.02;
  }

  if (outcome.trafficImpact > 0) {
    weights.traffic += 0.04;
  } else {
    weights.traffic -= 0.02;
  }

  // prevent drift explosion
  Object.keys(weights).forEach(k => {
    if (weights[k] < 0.1) weights[k] = 0.1;
    if (weights[k] > 3.0) weights[k] = 3.0;
  });

  saveWeights(weights);

  return weights;
}

// === DECISION ENGINE ===
function makeAdaptiveDecision(metrics) {
  const weights = loadWeights();

  const score = calculateDecisionScore(metrics, weights);

  let decision = "HOLD";

  if (score > 3.5) decision = "SCALE";
  else if (score > 2.0) decision = "OPTIMIZE";
  else if (score <= 2.0) decision = "REPAIR";

  return {
    score,
    decision,
    weights
  };
}

// === EXPORTS ===
module.exports = {
  loadWeights,
  saveWeights,
  calculateDecisionScore,
  updateWeightsFromOutcome,
  makeAdaptiveDecision
};

// === TEST RUN ===
if (require.main === module) {
  console.log("🧠 Running Adaptive Decision AI Test...");

  const result = makeAdaptiveDecision({
    seo: 1,
    revenue: 2,
    traffic: 1.5,
    stability: 0.8
  });

  console.log(result);

  const updated = updateWeightsFromOutcome({
    seoImpact: 1,
    revenueImpact: 1,
    trafficImpact: 0
  });

  console.log("Updated Weights:", updated);
}
