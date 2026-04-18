const fs = require("fs");
const path = require("path");

console.log("[MASTER RUNNER] 📦 Starting safe system loader...");

// --------------------------------------------------
// SAFE MODULE LOADER (NO CRASH EVER)
// --------------------------------------------------
function safeLoad(modulePath) {
  try {
    const fullJs = path.join(__dirname, modulePath + ".js");
    const fullIndex = path.join(__dirname, modulePath, "index.js");

    if (fs.existsSync(fullJs)) return require(fullJs);
    if (fs.existsSync(fullIndex)) return require(fullIndex);

    console.log("[MASTER RUNNER] ⚠ Missing module:", modulePath);
    return null;
  } catch (err) {
    console.log("[MASTER RUNNER] ❌ Failed:", modulePath);
    console.log(err.message);
    return null;
  }
}

// --------------------------------------------------
// LOAD MODULES SAFELY
// --------------------------------------------------

const contentChecker = safeLoad("./content-integrity-checker");

// --------------------------------------------------
// EXECUTE ONLY IF EXISTS
// --------------------------------------------------

if (contentChecker && typeof contentChecker.run === "function") {
  contentChecker.run();
} else {
  console.log("[MASTER RUNNER] ⚠ content-integrity-checker skipped (missing or invalid)");
}

// --------------------------------------------------
// SYSTEM CONTINUES NO MATTER WHAT
// --------------------------------------------------

console.log("[MASTER RUNNER] ✅ Boot sequence complete (non-blocking)");
