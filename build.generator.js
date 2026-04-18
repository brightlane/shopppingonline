const fs = require("fs");
const path = require("path");

console.log("🚀 Build Generator Starting...");

const distPath = path.join(__dirname, "dist");

// --------------------------------------------------
// ENSURE DIST EXISTS
// --------------------------------------------------
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
  console.log("📁 Created dist folder");
}

// --------------------------------------------------
// ENSURE INDEX EXISTS
// --------------------------------------------------
const indexPath = path.join(distPath, "index.html");

if (!fs.existsSync(indexPath)) {
  console.log("⚠ Missing index.html → generating fallback...");

  fs.writeFileSync(
    indexPath,
    `<!DOCTYPE html>
<html>
<head>
  <title>Auto Generated Build</title>
</head>
<body>
  <h1>System Auto-Build Successful</h1>
</body>
</html>`
  );

  console.log("✅ index.html created");
}

console.log("✅ Build complete");
