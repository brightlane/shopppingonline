const { execSync } = require("child_process");

console.log("🚀 AUTOPILOT STARTING FULL PIPELINE...");

/**
 * 🧠 STEP 1: rebuild product pages
 */
console.log("📦 Step 1: Rebuilding product pages...");
execSync("node rebuild-products.js", { stdio: "inherit" });

/**
 * 🧠 STEP 2: rebuild homepage with ranking
 */
console.log("📊 Step 2: Building ranked homepage...");
execSync("node auto-rank-build.js", { stdio: "inherit" });

/**
 * 🧠 STEP 3: (optional future SEO builder hook)
 */
console.log("🧠 Step 3: SEO layer placeholder...");

console.log("🏁 AUTOPILOT COMPLETE — SITE UPDATED");
