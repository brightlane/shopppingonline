'use strict';

const fs = require("fs");
const path = require("path");

function safeRequire(relativePath) {
  try {
    const fullPath = path.join(__dirname, relativePath);

    if (!fs.existsSync(fullPath + ".js") && !fs.existsSync(fullPath)) {
      console.log("[SAFE-REQUIRE] ⚠ Missing module:", relativePath);
      return null; // NEVER CRASH
    }

    return require(fullPath);
  } catch (err) {
    console.log("[SAFE-REQUIRE] ❌ Failed loading:", relativePath);
    console.log(err.message);
    return null;
  }
}

module.exports = safeRequire;
