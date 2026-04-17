const fs = require("fs");
const path = require("path");

const PRODUCTS = path.join(__dirname, "products-source.json");
const CLICKS = path.join(__dirname, "data/clicks.json");
const OUTPUT = path.join(__dirname, "dist");

/**
 * 📦 LOAD PRODUCTS
 */
function loadProducts() {
  return JSON.parse(fs.readFileSync(PRODUCTS, "utf-8"));
}

/**
 * 📊 LOAD CLICK DATA
 */
function loadClicks() {
  if (!fs.existsSync(CLICKS)) return {};
  return JSON.parse(fs.readFileSync(CLICKS, "utf-8"));
}

/**
 * 🧠 SCORE PRODUCTS
 */
function scoreProducts(products, clicks) {
  return products
    .map(p => ({
      ...p,
      score: clicks[p.asin] || 0
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * 🧱 BUILD CARD HTML
 */
function card(p) {

  return `
  <div class="card">

    <img src="${p.image}" style="width:100%;border-radius:10px;" />

    <h3>${p.title}</h3>

    <p>⭐ ${p.rating || "4.5"}</p>
    <p>$${p.price || "N/A"}</p>

    <p>🔥 Score: ${p.score}</p>

    <a href="/products/${p.asin}.html"
       style="display:block;padding:10px;background:#2563eb;color:white;text-align:center;border-radius:8px;text-decoration:none;">
       View Product
    </a>

  </div>
  `;
}

/**
 * 🚀 BUILD HOMEPAGE
 */
function buildIndex(products) {

  return `
<!DOCTYPE html>
<html>
<head>
  <title>🔥 Auto Ranked Store</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    body { font-family: Arial; padding:20px; background:#f5f6fa; }
    .grid {
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
      gap:20px;
    }
  </style>
</head>

<body>

<h1>🔥 Trending Products (Auto Ranked)</h1>

<div class="grid">

${products.map(card).join("")}

</div>

</body>
</html>
`;
}

/**
 * 🚀 RUN
 */
function run() {

  if (!fs.existsSync(OUTPUT)) {
    fs.mkdirSync(OUTPUT, { recursive: true });
  }

  const products = loadProducts();
  const clicks = loadClicks();

  const ranked = scoreProducts(products, clicks);

  const html = buildIndex(ranked);

  fs.writeFileSync(path.join(OUTPUT, "index.html"), html);

  console.log("🏁 AUTO-RANKED HOMEPAGE BUILT");
}

run();
