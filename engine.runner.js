'use strict';

const path = require("path");

// CORE IMPORTS (SAFE BOOTSTRAP)
const SystemGuard = require("./core/system.guard.js");
const orchestrator = require("./core.orchestrator.js");

console.log("\n==============================");
console.log("🚀 ENGINE RUNNER STARTING");
console.log("==============================\n");

try {
  // 1. Check system integrity first
  SystemGuard.validateCoreFiles();

  // 2. Run orchestrator safely
  if (typeof orchestrator === "function") {
    orchestrator();
  } else if (orchestrator.run) {
    orchestrator.run();
  } else {
    console.log("⚠ Orchestrator has no valid entry method");
  }

  console.log("\n✅ ENGINE RUN COMPLETE\n");

} catch (err) {
  console.error("\n❌ ENGINE FAILED SAFETY STOP");
  console.error(err.message);

  process.exit(1);
}
