const { execSync } = require("child_process");

console.log("🚀 MASTER BUILD STARTING...");

/**
 * STEP 1 — CLEAN DATA (CRITICAL FIRST)
 */
console.log("\n🧼 Step 1: Product sanity check...");
execSync("node product-sanity.js", { stdio: "inherit" });

/**
 * STEP 2 — REBUILD PRODUCT PAGES
 */
console.log("\n📦 Step 2: Rebuilding product pages...");
execSync("node rebuild-products.js", { stdio: "inherit" });

/**
 * STEP 3 — BUILD HUBS (COFFEE, ETC.)
 */
console.log("\n🏗 Step 3: Building category hubs...");
execSync("node hub-render-engine.js", { stdio: "inherit" });

/**
 * STEP 4 — BUILD RANKED HOMEPAGE
 */
console.log("\n📊 Step 4: Building ranked homepage...");
execSync("node auto-rank-build.js", { stdio: "inherit" });

/**
 * STEP 5 — FINAL LOG
 */
console.log("\n🏁 MASTER BUILD COMPLETE — SITE IS NOW CONSISTENT");
