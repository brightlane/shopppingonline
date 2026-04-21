const fs = require("fs");
const path = require("path");

// =========================
// LOAD FEED
// =========================
const feedPath = path.join(__dirname, "../feed.json");

if (!fs.existsSync(feedPath)) {
  console.error("❌ feed.json missing. Run feeder.js first.");
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(feedPath, "utf-8"));

// =========================
// GROUP BY CATEGORY
// =========================
const categories = {};

for (const p of products) {
  if (!categories[p.category]) {
    categories[p.category] = [];
  }
  categories[p.category].push(p);
}

// =========================
// OUTPUT DIR
// =========================
const outputDir = path.join(__dirname, "../pages");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// =========================
// BUILD HUB PAGES
// =========================
for (const category in categories) {
  const items = categories[category];

  let links = "";

  for (const p of items) {
    links += `<li><a href="./${p.asin}.html">${p.title}</a></li>\n`;
  }

  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${category} - Best Products</title>
  <meta name="description" content="Top ${category} products and reviews">
</head>

<body>

  <h1>${category.toUpperCase()} HUB</h1>

  <p>Best products in ${category}:</p>

  <ul>
    ${links}
  </ul>

</body>
</html>
`;

  fs.writeFileSync(
    path.join(outputDir, `${category}.html`),
    html
  );
}

console.log("====================================");
console.log("✅ HUB PAGES CREATED");
console.log("📂 Categories:", Object.keys(categories).length);
console.log("====================================");
