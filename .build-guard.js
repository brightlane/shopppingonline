const fs = require("fs");
const path = require("path");

/**
 * 🔒 ABSOLUTE LOCKED FILES
 * These files MUST NEVER be overwritten by any generator or script.
 */
const LOCKED_FILES = new Set([
  "index.html",
  "home.html",
  "404.html"
]);

/**
 * 🚨 HARD BLOCK: prevents writing to protected files
 */
function assertSafeWrite(filePath) {
  const fileName = path.basename(filePath);

  if (LOCKED_FILES.has(fileName)) {
    console.error("\n====================================");
    console.error("🚨 BUILD ERROR: PROTECTED FILE WRITE");
    console.error("====================================");
    console.error("❌ Attempted file:", fileName);
    console.error("❌ Full path:", filePath);
    console.error("\n👉 This file is LOCKED and cannot be modified by generators.");
    console.error("👉 Fix: remove index.html from generate.js or workflow.\n");

    process.exit(1); // HARD STOP BUILD
  }
}

/**
 * ✍️ SAFE WRITE FUNCTION (USE THIS IN ALL GENERATORS)
 */
function safeWriteFile(filePath, content, encoding = "utf-8") {
  assertSafeWrite(filePath);

  fs.writeFileSync(filePath, content, encoding);

  console.log("✅ SAFE WRITE:", filePath);
}

/**
 * 🗑️ SAFE DELETE FUNCTION (prevents accidental homepage deletion)
 */
function safeDeleteFile(filePath) {
  const fileName = path.basename(filePath);

  if (LOCKED_FILES.has(fileName)) {
    console.error("🚨 BLOCKED DELETE:", fileName);
    return false;
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("🗑️ DELETED:", filePath);
    return true;
  }

  return false;
}

/**
 * 🔍 OPTIONAL: scan project for unsafe patterns
 * (helps detect bad generator logic early)
 */
function scanProjectWarnings(dir = ".") {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    if (file === "index.html") {
      console.log("🔒 Protected file present (OK): index.html");
    }
  });
}

/**
 * 📦 EXPORT MODULE
 */
module.exports = {
  safeWriteFile,
  safeDeleteFile,
  scanProjectWarnings,
  LOCKED_FILES
};
