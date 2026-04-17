const fs = require("fs");

// ---------------------------
// DEBUG START
// ---------------------------
console.log("🚀 GENERATOR STARTED");
console.log("📂 CURRENT DIR:", __dirname);
console.log("📂 FILES:", fs.readdirSync("."));

// ---------------------------
// LOAD PRODUCT DATA
// ---------------------------
let PRODUCTS = [];

try {
  const raw = fs.readFileSync("./products-data.json", "utf-8");
  PRODUCTS = JSON.parse(raw);
} catch (err) {
  console.error("❌ ERROR: Cannot load products-data.json");
  console.error(err);
  process.exit(1);
}

console.log("📦 PRODUCT COUNT:", PRODUCTS.length);

if (!PRODUCTS.length) {
  console.log("⚠️ No products found — stopping build.");
  process.exit(0);
}

// ---------------------------
// CONFIG
// ---------------------------
const AFFILIATE_TAG = "brightlane201-20";

// ---------------------------
// HELPERS
// ---------------------------
function escapeHTML(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

// ---------------------------
// GROUP PRODUCTS
// ---------------------------
const grouped = {};

for (const p of PRODUCTS) {
  if (!p.category) {
    console.log("⚠️ Missing category:", p);
    continue;
  }

  if (!grouped[p.category]) grouped[p.category] = [];
  grouped[p.category].push(p);

  console.log("✔ Added:", p.title, "→", p.category);
}

console.log("📂 GROUPS:", Object.keys(grouped));

// ---------------------------
// PRODUCT BLOCK
// ---------------------------
function productBlock(p, i) {
  return `
  <div style="background:white;padding:15px;margin-bottom:20px;border-radius:10px;">
    <h2>#${i + 1} - ${escapeHTML(p.title || "Untitled Product")}</h2>
    <img src="${escapeHTML(p.image || "")}" width="200" loading="lazy"/>
    <p>${escapeHTML(p.description || "No description available")}</p>

    <a href="https://www.amazon.com/dp/${p.asin}?tag=${AFFILIATE_TAG}"
       target="_blank"
       style="display:inline-block;padding:10px 14px;background:#ff9900;color:#fff;border-radius:6px;">
       View on Amazon
    </a>
  </div>
  `;
}

// ---------------------------
// PAGE BUILDER
// ---------------------------
function buildPage(category, items) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Best ${category} Products 2026</title>
</head>

<body style="font-family:Arial;max-width:900px;margin:auto;padding:20px;background:#f7f7f7;">

<h1>Best ${category} Products</h1>

<p style="font-size:12px;color:gray;">
As an Amazon Associate, we earn from qualifying purchases.
</p>

${items.map(productBlock).join("")}

</body>
</html>
`;
}

// ---------------------------
// GENERATE FILES
// ---------------------------
for (const cat of Object.keys(grouped)) {
  const fileName = `best-${slugify(cat)}.html`;

  console.log("🧠 GENERATING:", fileName);

  const html = buildPage(cat, grouped[cat]);

  fs.writeFileSync(fileName, html);

  console.log("📁 FILE WRITTEN:", fileName);
}

// ---------------------------
// INDEX PAGE
// ---------------------------
const index = `
<html>
<body>
<h1>Best Products 2026</h1>
<ul>
${Object.keys(grouped)
  .map(c => `<li><a href="best-${slugify(c)}.html">${c}</a></li>`)
  .join("")}
</ul>
</body>
</html>
`;

fs.writeFileSync("index.html", index);

console.log("✅ GENERATION COMPLETE");
