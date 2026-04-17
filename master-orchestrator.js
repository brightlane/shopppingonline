const { execSync } = require("child_process");

console.log("\n🚀 ===============================");
console.log("   FULL AUTOPILOT BUILD START");
console.log("================================\n");

function run(step, cmd) {
  console.log(`\n▶️ ${step}...\n`);
  execSync(`node ${cmd}`, { stdio: "inherit" });
}

/**
 * 1. SANITIZE DATA (MUST BE FIRST)
 */
run("1. Product Sanitizer", "product-sanitizer-final.js");

/**
 * 2. BUILD PRODUCT PAGES
 */
run("2. Product Pages", "product-page-builder.js");

/**
 * 3. BUILD HUBS (AUTO CATEGORY SYSTEM)
 */
run("3. Auto Hub Generator", "auto-hub-generator.js");

/**
 * 4. BUILD NAV SYSTEM (if used)
 */
run("4. Navigation Builder", "nav-builder.js");

/**
 * 5. MASTER VALIDATION (DEPLOY GUARD)
 */
run("5. Deploy Guard", "deploy-guard.js");

console.log("\n🏁 ===============================");
console.log("   BUILD COMPLETE — SYSTEM READY");
console.log("================================\n");
