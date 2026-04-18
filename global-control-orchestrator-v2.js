/**
 * global-control-orchestrator-v2.js
 * AAC Unified Decision Brain (Enterprise Core)
 * Merges SEO, CTR, Revenue, and Health signals into one control system
 */

const fs = require("fs");
const path = require("path");

// === INPUT SIGNAL FILES ===
const DEPLOY_REPORT = path.join(__dirname, "cache/deploy-report.json");
const REVENUE_DATA = path.join(__dirname, "cache/revenue-data.json");

// === ENTRY POINT ===
function runOrchestratorV2() {
  console.log("🧠 Running Global Control Orchestrator v2...");

  const seoSignals = loadJSON(DEPLOY_REPORT);
  const revenueSignals = loadJSON(REVENUE_DATA);

  const decisionMap = buildDecisionMap(seoSignals, revenueSignals);

  const actions = generateActions(decisionMap);

  saveActions(actions);

  executeActions(actions);

  console.log("✅ Orchestrator v2 Complete");
}

// === LOAD JSON SAFE ===
function loadJSON(file) {
  try {
    if (!fs.existsSync(file)) return {};
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    return {};
  }
}

// === CORE INTELLIGENCE MERGE ENGINE ===
function buildDecisionMap(seo, revenue) {
  const pages = {};

  const weakPages = seo?.weak || [];
  const brokenPages = seo?.broken || [];

  Object.keys(revenue?.products || {}).forEach(id => {
    const r = revenue.products[id];

    pages[id] = {
      id,
      seoRisk: weakPages.includes(id) ? 1 : 0,
      brokenRisk: brokenPages.includes(id) ? 1 : 0,
      revenueScore: r.revenueScore || 0,
      priority: "LOW"
    };

    // === DECISION SCORE MODEL ===
    pages[id].decisionScore =
      (pages[id].revenueScore * 2) -
      (pages[id].seoRisk * 2) -
      (pages[id].brokenRisk * 3);

    // === PRIORITY ASSIGNMENT ===
    if (pages[id].decisionScore > 5) {
      pages[id].priority = "BOOST";
    } else if (pages[id].decisionScore > 2) {
      pages[id].priority = "OPTIMIZE";
    } else {
      pages[id].priority = "REWRITE";
    }
  });

  return pages;
}

// === ACTION GENERATION ENGINE ===
function generateActions(decisionMap) {
  const actions = {
    boost: [],
    optimize: [],
    rewrite: []
  };

  Object.values(decisionMap).forEach(item => {
    if (item.priority === "BOOST") {
      actions.boost.push(item.id);
    } else if (item.priority === "OPTIMIZE") {
      actions.optimize.push(item.id);
    } else {
      actions.rewrite.push(item.id);
    }
  });

  return actions;
}

// === SAVE ACTION QUEUE ===
function saveActions(actions) {
  const file = path.join(__dirname, "cache/action-plan.json");

  fs.mkdirSync(path.dirname(file), { recursive: true });

  fs.writeFileSync(file, JSON.stringify({
    timestamp: Date.now(),
    actions
  }, null, 2));
}

// === EXECUTION ENGINE (HOOK POINTS FOR SYSTEM) ===
function executeActions(actions) {
  console.log("⚙️ Executing system actions...");

  // BOOST
  actions.boost.forEach(id => {
    console.log(`🚀 BOOST: ${id}`);
  });

  // OPTIMIZE
  actions.optimize.forEach(id => {
    console.log(`⚡ OPTIMIZE: ${id}`);
  });

  // REWRITE
  actions.rewrite.forEach(id => {
    console.log(`✏️ REWRITE: ${id}`);
  });

  // Future hook: trigger rewriter + orchestrator + deploy pipeline
}

// === EXPORTS ===
module.exports = {
  runOrchestratorV2
};

// === AUTO RUN ===
if (require.main === module) {
  runOrchestratorV2();
}
