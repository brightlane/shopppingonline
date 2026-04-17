const fs = require("fs");

// ---------------------------
// LOAD PRODUCT DATA (SAFE)
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

// ---------------------------
// CONFIG
// ---------------------------
const AFFILIATE_TAG = "brightlane201-20";

// ---------------------------
// DEBUG START
// ---------------------------
console.log("🚀 GENERATOR STARTED");
console.log("📦 PRODUCT COUNT:", PRODUCTS.length);

if (!PRODUCTS.length) {
  console.log("⚠️ No products found — stopping build.");
  process.exit(0);
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
// PAGE BUILDER
// ---------------------------
function buildPage(category, items) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Best ${category} Products 2026</title>
  <meta name="description" content="Top ${category} products reviewed and compared for 2026">
</head>

<body style="font-family:Arial;max-width:900px;margin:auto;padding:20px;background:#f7f7f7;">

  <h1>Best ${category} Products</h1>

  <p>Comparison guide based on performance, value, and user feedback.</p>

  ${items.map(productBlock).join("")}

</body>
</html>
  `;
}

// ---------------------------
// PRODUCT BLOCK
// ---------------------------
function productBlock(p, i) {
  return `
  <div style="background:white;padding:15px;margin-bottom:20px;border-radius:10px;">

    <h2>${p.title || "Untitled Product"}</h2>

    <img src="${p.image}" width="200" />

    <p>${p.description || "No description available"}</p>

    <a href="https://www.amazon.com/dp/${p.asin}?tag=${AFFILIATE_TAG}"
       target="_blank"
       style="display:inline-block;padding:10px 14px;background:#ff9900;color:#fff;border-radius:6px;">
       View on Amazon
    </a>

  </div>
  `;
}

// ---------------------------
// GENERATE FILES
// ---------------------------
for (const cat of Object.keys(grouped)) {
  const fileName = `best-${cat}.html`;

  console.log("🧠 GENERATING:", fileName);

  const html = buildPage(cat, grouped[cat]);

  fs.writeFileSync(fileName, html);
}

console.log("✅ GENERATION COMPLETE");
