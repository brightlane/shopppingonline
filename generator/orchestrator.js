const { execSync } = require("child_process");

console.log("====================================");
console.log("🧠 AUTONOMOUS ORCHESTRATOR STARTING");
console.log("====================================");

function run(step, command) {
  console.log(`\n🚀 Running: ${step}`);
  try {
    execSync(command, { stdio: "inherit" });
    console.log(`✅ Completed: ${step}`);
  } catch (err) {
    console.error(`❌ Failed: ${step}`);
    process.exit(1);
  }
}

// =========================
// EXECUTION PIPELINE
// =========================

run("Feeder", "node feeder.js");

run("Build Pages", "node generator/build-pages.js");

run("Build Hubs", "node generator/build-hubs.js");

run("Internal Linking", "node generator/internal-linker.js");

run("SEO Content Engine", "node generator/seo-content-engine.js");

run("Ranking AI Layer", "node generator/ranking-ai-layer.js");

run("Conversion Engine", "node generator/conversion-engine.js");

run("Self-Healing Engine", "node generator/self-healing-engine.js");

run("Traffic Engine", "node generator/traffic-engine.js");

// =========================
// DONE
// =========================
console.log("\n====================================");
console.log("🧠 ORCHESTRATION COMPLETE");
console.log("🌍 SYSTEM FULLY UPDATED");
console.log("====================================");
