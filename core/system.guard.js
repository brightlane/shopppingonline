// /core/system.guard.js

const fs = require("fs");
const path = require("path");

const SystemGuard = {
  log: (msg) => console.log("[SYSTEM-GUARD]", msg),

  checkFile: function (relativePath) {
    const fullPath = path.join(__dirname, "..", relativePath);
    return fs.existsSync(fullPath);
  },

  validateCoreFiles: function () {
    this.log("Running system integrity check...");

    const requiredFiles = [
      "config/config.js",
      "core.orchestrator.js",
      "scripts/affiliate-routing-brain.js"
    ];

    let missing = [];

    requiredFiles.forEach((file) => {
      if (!this.checkFile(file)) {
        missing.push(file);
      }
    });

    if (missing.length > 0) {
      this.log("❌ Missing critical files:");
      missing.forEach(f => this.log(" - " + f));

      throw new Error("System boot aborted: missing required modules");
    }

    this.log("✅ All core files present");
    return true;
  },

  safeRequire: function (modulePath) {
    try {
      return require(modulePath);
    } catch (err) {
      this.log("❌ Failed to load module: " + modulePath);
      this.log(err.message);
      return null;
    }
  }
};

module.exports = SystemGuard;
