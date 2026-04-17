const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const PRODUCTS_FILE = path.join(__dirname, "products-source.json");

let lastHash = "";

/**
 * 🧠 SIMPLE FILE HASH CHECK
 */
function hashFile() {
  return fs.readFileSync(PRODUCTS_FILE, "utf-8");
}

/**
 * 🚀 RUN FULL PIPELINE
 */
function runPipeline() {
  console.log("\n🚀 CHANGE DETECTED — RUNNING FULL AUTOPILOT PIPELINE...\n");

  execSync("node master-build.js", { stdio: "inherit" });
  execSync("node deploy-guard.js", { stdio: "inherit" });

  console.log("\n🏁 AUTOPILOT CYCLE COMPLETE\n");
}

/**
 * 👀 WATCH LOOP
 */
function watch() {

  console.log("👀 WATCHER STARTED — monitoring product-source.json...\n");

  lastHash = hashFile();

  setInterval(() => {

    const current = hashFile();

    if (current !== lastHash) {

      lastHash = current;

      runPipeline();
    }

  }, 3000); // check every 3 seconds
}

watch();
