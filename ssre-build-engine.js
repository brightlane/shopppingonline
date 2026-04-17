const fs = require("fs");
const path = require("path");

/**
 * 🔥 CONFIG
 */
const SOURCE_FILE = path.join(__dirname, "products-source.json");
const OUTPUT_DIR = path.join(__dirname, "dist");

/**
 * 🧠 AFFILIATE TAG
 */
const AFFILIATE_TAG = "brightlane201-20";

/**
 * 🧠 SAFE HELPERS
 */
function isASIN(asin) {
  return typeof asin === "string" && /^[A-Z0-9]{10}$/.test(asin);
}

function safeImage(img) {
  return img && img.startsWith("http")
    ? img
    : "https://via.placeholder.com/600x400?text=No+Image";
}

function amazonLink(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

/**
 * 📦 LOAD DATA (SINGLE SOURCE OF TRUTH)
 */
function loadProducts() {
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error("❌ Missing products-source.json");
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(SOURCE_FILE, "utf-8"));
}

/**
 * 🧹 CLEAN DATASET
 */
function clean(products) {
  const clean = [];

  products.forEach(p => {
    if (!isASIN(p.asin)) {
      console.log("❌ Removed invalid ASIN:", p.asin);
      return;
    }

    if (!p.title) return;

    clean.push({
      asin: p.asin,
      title: p.title,
      category: p.category || "general",
      image: safeImage(p.image),
      link: amazonLink(p.asin)
    });
  });

  return clean;
}

/**
 * 🏗️ BUILD PRODUCT PAGE
 */
function buildProductPage(p) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${p.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial; max-width: 800px; margin: auto; padding: 20px; }
    img { width: 100%; border-radius: 10px; }
    .btn {
      display:inline-block;
      padding:12px 16px;
      background:#2563eb;
      color:white;
      text-decoration:none;
      border-radius:8px;
      margin-top:20px;
    }
  </style>
</head>
<body>

<h1>${p.title}</h1>

<img src="${p.image}" alt="${p.title}" />

<p>Best price available on Amazon.</p>

<a class="btn" href="${p.link}" target="_blank" rel="nofollow sponsored">
Buy on Amazon
</a>

</body>
</html>`;
}

/**
 * 🏗️ BUILD HUB PAGE
 */
function buildHub(category, items) {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${category} Hub</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial; background:#f5f5f5; margin:0; }
    .wrap { max-width:900px; margin:auto; padding:20px; }
    .card { background:white; padding:15px; margin:10px 0; border-radius:10px; }
    img { width:100%; border-radius:10px; }
    a.btn {
      display:inline-block;
      padding:10px 14px;
      background:#16a34a;
      color:white;
      text-decoration:none;
      border-radius:6px;
    }
  </style>
</head>
<body>

<div class="wrap">

<h1>🔥 ${category.toUpperCase()} Hub</h1>
<p>Top products in this category</p>
`;

  items.forEach(p => {
    html += `
      <div class="card">
        <h3>${p.title}</h3>
        <img src="${p.image}" />
        <br>
        <a class="btn" href="${p.asin}.html">View Product</a>
      </div>
    `;
  });

  html += `
</div>
</body>
</html>`;

  return html;
}

/**
 * 🏠 BUILD INDEX PAGE
 */
function buildIndex(categories) {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Affiliate Store</title>
</head>
<body>
<h1>🔥 Best Product Categories</h1>
<ul>
`;

  Object.keys(categories).forEach(cat => {
    html += `<li><a href="${cat}.html">${cat}</a></li>`;
  });

  html += `
</ul>
</body>
</html>`;

  return html;
}

/**
 * 🚀 MAIN BUILD SYSTEM
 */
function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  const raw = loadProducts();
  const products = clean(raw);

  const categories = {};

  products.forEach(p => {
    if (!categories[p.category]) categories[p.category] = [];
    categories[p.category].push(p);
  });

  /**
   * 📦 BUILD PRODUCT PAGES
   */
  products.forEach(p => {
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${p.asin}.html`),
      buildProductPage(p)
    );
  });

  /**
   * 📦 BUILD HUBS
   */
  Object.keys(categories).forEach(cat => {
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${cat}.html`),
      buildHub(cat, categories[cat])
    );
  });

  /**
   * 📦 BUILD INDEX
   */
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "index.html"),
    buildIndex(categories)
  );

  console.log("✅ SINGLE SOURCE SITE BUILT");
}

run();
