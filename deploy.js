const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "docs");

console.log("\n🚀 ===============================");
console.log("   CLEAN DEPLOY PIPELINE START");
console.log("================================\n");

/**
 * 🧹 RESET DOCS FOLDER
 */
function resetDocs() {
  if (fs.existsSync(DOCS_DIR)) {
    fs.rmSync(DOCS_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DOCS_DIR, { recursive: true });
  console.log("✅ /docs reset complete");
}

/**
 * ▶ RUN STEP
 */
function run(stepName, file) {
  console.log(`\n▶️ ${stepName}`);
  execSync(`node ${file}`, { stdio: "inherit" });
}

/**
 * 🚀 PIPELINE ORDER (CRITICAL)
 */
function build() {
  resetDocs();

  // 1. clean + validate products
  run("Sanitizing Products", "product-sanitizer-final.js");

  // 2. build product pages
  run("Building Product Pages", "product-page-builder.js");

  // 3. build category hubs
  run("Building Category Hubs", "auto-hub-generator.js");

  // 4. build navigation
  run("Building Navigation", "nav-builder.js");

  // 5. FINAL RENDER (IMPORTANT FIX LAYER)
  run("Rendering Final Site", "render-engine.js");
}

/**
 * 🧪 VERIFY OUTPUT
 */
function verify() {
  const indexPath = path.join(DOCS_DIR, "index.html");

  if (!fs.existsSync(indexPath)) {
    console.error("\n❌ DEPLOY FAILED: index.html missing in /docs");
    process.exit(1);
  }

  console.log("\n✅ VERIFY PASSED: index.html exists");
}

/**
 * 🚀 RUN EVERYTHING
 */
function runDeploy() {
  build();
  verify();

  console.log("\n🏁 ===============================");
  console.log("   DEPLOY COMPLETE — READY FOR GITHUB PAGES");
  console.log("================================\n");
}

runDeploy();
