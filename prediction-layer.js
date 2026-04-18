/**
 * prediction-layer.js
 * AAC Predictive Intelligence Layer
 * Forecasts performance of pages/products before execution
 */

const fs = require("fs");
const path = require("path");

// === CONFIG ===
const HISTORY_FILE = path.join(__dirname, "cache/performance-history.json");
const PREDICTION_LOG = path.join(__dirname, "cache/predictions.json");

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

// === SAVE PREDICTIONS ===
function savePredictions(predictions) {
  fs.mkdirSync(path.dirname(PREDICTION_LOG), { recursive: true });

  fs.writeFileSync(
    PREDICTION_LOG,
    JSON.stringify(predictions, null, 2)
  );
}

// === CORE PREDICTION ENGINE ===
function predictPerformance(input) {
  /**
   * Input example:
   * {
   *   keywordDifficulty: 0-1,
   *   affiliateStrength: 0-1,
   *   contentQuality: 0-1,
   *   trafficPotential: 0-1
   * }
   */

  const score =
    (input.keywordDifficulty * -0.4) +
    (input.affiliateStrength * 0.3) +
    (input.contentQuality * 0.5) +
    (input.trafficPotential * 0.6);

  let prediction = "LOW";

  if (score > 1.0) prediction = "HIGH";
  else if (score > 0.5) prediction = "MEDIUM";

  return {
    score: round(score),
    prediction
  };
}

// === SIMPLE HISTORICAL BIAS ADJUSTMENT ===
function adjustWithHistory(score, history) {
  if (!history.length) return score;

  const avgPerformance =
    history.reduce((sum, h) => sum + (h.actual || 0), 0) / history.length;

  // adjust score slightly based on system bias
  return score * (1 + (avgPerformance - 0.5) * 0.1);
}

// === MAIN PREDICT FUNCTION ===
function runPrediction(input) {
  const history = loadHistory();

  let base = predictPerformance(input);

  const adjustedScore = adjustWithHistory(base.score, history);

  let finalPrediction = "LOW";

  if (adjustedScore > 1.0) finalPrediction = "HIGH";
  else if (adjustedScore > 0.5) finalPrediction = "MEDIUM";

  const result = {
    input,
    rawScore: base.score,
    adjustedScore: round(adjustedScore),
    prediction: finalPrediction,
    timestamp: Date.now()
  };

  logPrediction(result);

  return result;
}

// === LOG PREDICTIONS ===
function logPrediction(result) {
  let logs = [];

  if (fs.existsSync(PREDICTION_LOG)) {
    try {
      logs = JSON.parse(fs.readFileSync(PREDICTION_LOG, "utf8"));
    } catch (e) {
      logs = [];
    }
  }

  logs.push(result);

  if (logs.length > 500) logs = logs.slice(-500);

  savePredictions(logs);
}

// === ROUND HELPER ===
function round(n) {
  return Math.round(n * 100) / 100;
}

// === EXPORTS ===
module.exports = {
  predictPerformance,
  runPrediction
};

// === TEST RUN ===
if (require.main === module) {
  console.log("🔮 Running Prediction Layer...");

  const result = runPrediction({
    keywordDifficulty: 0.3,
    affiliateStrength: 0.8,
    contentQuality: 0.7,
    trafficPotential: 0.6
  });

  console.log(result);
}
