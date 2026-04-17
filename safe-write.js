const fs = require("fs");
const path = require("path");

// 🔒 HARD PROTECTED FILES (NEVER TOUCH THESE)
const PROTECTED_FILES = new Set([
  "index.html",
  "home.html",
  "404.html"
]);

function safeWrite(filePath, content) {
  const fileName = path.basename(filePath);

  // BLOCK INDEX.HTML OVERWRITE
  if (PROTECTED_FILES.has(fileName)) {
    console.log("🚫 BLOCKED WRITE TO PROTECTED FILE:", fileName);
    return false;
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log("✅ WRITTEN:", filePath);
  return true;
}

function safeDelete(filePath) {
  const fileName = path.basename(filePath);

  if (PROTECTED_FILES.has(fileName)) {
    console.log("🚫 BLOCKED DELETE OF PROTECTED FILE:", fileName);
    return false;
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("🗑️ DELETED:", filePath);
  }

  return true;
}

module.exports = {
  safeWrite,
  safeDelete
};
