const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "../dist");

function buildSEO() {
  console.log("🧠 Building SEO pages...");

  if (!fs.existsSync(DIST)) fs.mkdirSync(DIST);

  const page = `
<!DOCTYPE html>
<html>
<head>
<title>Best Vacuum Cleaners 2026</title>
<meta name="description" content="Top vacuum cleaners ranked for 2026">
</head>
<body>
<h1>Best Vacuum Cleaners 2026</h1>
<a href="vacuum-hub.html">Enter Hub</a>
</body>
</html>
`;

  fs.writeFileSync(path.join(DIST, "index.html"), page);

  console.log("✅ SEO page built");
}

module.exports = { buildSEO };
