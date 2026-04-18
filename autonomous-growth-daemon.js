/**
 * autonomous-growth-daemon.js
 * AAC Always-On Growth Engine
 * Continuously runs expansion, SEO, revenue, and optimization loops
 */

const { runOrchestrator } = require("./core.orchestrator");
const { runOrchestratorV2 } = require("./global-control-orchestrator-v2");
const { runDeploymentMonitor } = require("./deployment-monitor");
const { runRewriter } = require("./autonomous-content-rewriter");
const { runRevenueEngine } = require("./revenue-optimization-engine");

const fs = require("fs");
const path = require("path");

// === CONFIG ===
const INTERVAL_MINUTES = 30; // adjust cycle speed here
const LOG_FILE = path.join(__dirname, "cache/daemon.log");

// === ENTRY POINT ===
function startDaemon() {
  console.log("🟢 AAC Autonomous Growth Daemon STARTED");

  log("Daemon started");

  // Initial run immediately
  runCycle();

  // Continuous loop
  setInterval(runCycle, INTERVAL_MINUTES * 60 * 1000);
}

// === MAIN CYCLE ===
function runCycle() {
  console.log("🔄 Running Growth Cycle...");

  try {
    // 1. Generate / expand content
    runOrchestrator();

    // 2. Run decision brain (SEO + revenue fusion)
    runOrchestratorV2();

    // 3. Monitor deployment health
    runDeploymentMonitor();

    // 4. Fix weak content automatically
    runRewriter();

    // 5. Optimize revenue scoring
    runRevenueEngine();

    log("Cycle completed successfully");

    console.log("✅ Growth Cycle Complete");
  } catch (err) {
    console.error("❌ Cycle error:", err.message);
    log(`ERROR: ${err.message}`);
  }
}

// === LOGGING ===
function log(message) {
  const entry = `[${new Date().toISOString()}] ${message}\n`;

  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  fs.appendFileSync(LOG_FILE, entry);
}

// === SAFETY STOP (optional hook) ===
function stopDaemon() {
  log("Daemon stopped manually");
  process.exit(0);
}

// === EXPORTS ===
module.exports = {
  startDaemon,
  stopDaemon
};

// === AUTO START ===
if (require.main === module) {
  startDaemon();
}
