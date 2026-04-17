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
  <div style="background:white;padding:15px;margin-bottom:20px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
    <h2>#${i + 1} - ${escapeHTML(p.title || "Untitled Product")}</h2>
    <img src="${escapeHTML(p.image || "")}" width="200" height="200" style="border-radius:8px;" loading="lazy"/>
    <p>${escapeHTML(p.description || "No description available")}</p>

    <a href="https://www.amazon.com/dp/${p.asin}?tag=${AFFILIATE_TAG}"
       target="_blank" rel="nofollow sponsored"
       style="display:inline-block;padding:12px 20px;background:#ff9900;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">
       🛒 View on Amazon
    </a>
  </div>
  `;
}

// ---------------------------
// PAGE BUILDER
// ---------------------------
function buildPage(category, items) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Best ${escapeHTML(category)} Products 2026</title>
  <meta name="description" content="Discover the best ${category.toLowerCase()} products on Amazon. Expert recommendations for 2026.">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;max-width:900px;margin:auto;padding:20px;background:#f8f9fa;">
  <header style="text-align:center;margin-bottom:40px;">
    <h1 style="color:#1a1a1a;">Best ${escapeHTML(category)} Products 2026</h1>
    <p style="color:#666;font-size:14px;">Top-rated ${category.toLowerCase()} handpicked for quality and value</p>
  </header>

  <div style="background:#fff;padding:30px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
    <p style="font-size:12px;color:#888;text-align:center;margin-bottom:30px;background:#f0f0f0;padding:15px;border-radius:8px;">
      <strong>As an Amazon Associate, we earn from qualifying purchases.</strong>
    </p>

    ${items.map(productBlock).join("\n\n")}

    <div style="text-align:center;margin-top:40px;padding-top:30px;border-top:2px solid #eee;">
      <p style="color:#666;">© 2026 Best Products Hub | <a href="index.html">All Categories</a></p>
    </div>
  </div>
</body>
</html>`;
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
const index = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Best Products 2026 - All Categories</title>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;max-width:900px;margin:auto;padding:20px;background:#f8f9fa;">
  <header style="text-align:center;margin-bottom:50px;">
    <h1 style="color:#1a1a1a;font-size:2.5em;">🏆 Best Products 2026</h1>
    <p style="color:#666;font-size:18px;">Discover top Amazon picks across all categories</p>
  </header>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;">
    ${Object.keys(grouped)
      .map(c => `
        <div style="background:#fff;padding:30px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);text-align:center;">
          <h2 style="color:#333;margin-bottom:15px;">${escapeHTML(c)}</h2>
          <a href="best-${slugify(c)}.html" style="display:inline-block;padding:15px 30px;background:#ff9900;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">View ${c} →</a>
        </div>
      `).join("")}
  </div>
</body>
</html>`;

fs.writeFileSync("index.html", index);

console.log("✅ GENERATION COMPLETE - Check index.html and best-*.html");
