const fs = require("fs");
const path = require("path");

console.log("🚀 BUILD START");

const dist = path.join(__dirname, "dist");

// always recreate dist safely
fs.mkdirSync(dist, { recursive: true });

const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Auto Build</title>
</head>
<body>
  <h1>Build Successful</h1>
  <p>Generated at: ${new Date().toISOString()}</p>
</body>
</html>
`;

fs.writeFileSync(path.join(dist, "index.html"), html);

console.log("✅ dist/index.html created");
