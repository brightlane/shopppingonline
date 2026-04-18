'use strict';

const fs = require("fs");
const path = require("path");

console.log("[CONTENT CHECKER] Initializing...");

const ContentIntegrityChecker = {
  log: (msg) => console.log("[CONTENT CHECKER]", msg),

  fileExists(filePath) {
    return fs.existsSync(path.join(__dirname, filePath));
  },

  validateRequiredModules() {
    const required = [
      "master-system-runner.js",
      "engine.runner.js",
      "core.orchestrator.js",
      "boot.resolver.js"
    ];

    let missing = [];

    required.forEach(file => {
      if (!this.fileExists(file)) {
        missing.push(file);
      }
    });

    if (missing.length > 0) {
      this.log("❌ Missing critical system files:");
      missing.forEach(f => this.log(" - " + f));
      throw new Error("System integrity failed: missing modules");
    }

    this.log("✅ All core modules present");
    return true;
  },

  validatePagesFolder() {
    const pagesPath = path.join(__dirname, "pages");

    if (!fs.existsSync(pagesPath)) {
      this.log("⚠ pages folder missing → creating...");
      fs.mkdirSync(pagesPath, { recursive: true });
    }

    const files = fs.readdirSync(pagesPath);

    this.log(`📄 Pages found: ${files.length}`);

    return files;
  },

  run() {
    this.log("Running full integrity scan...");

    this.validateRequiredModules();
    this.validatePagesFolder();

    this.log("🧠 Integrity check COMPLETE");
    return true;
  }
};

module.exports = ContentIntegrityChecker;
