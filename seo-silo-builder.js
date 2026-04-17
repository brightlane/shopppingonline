const fs = require("fs");
const path = require("path");

/**
 * 🔥 CONFIG
 */
const SITE_ROOT = __dirname;
const OUTPUT_DIR = path.join(SITE_ROOT, "hubs");

/**
 * 🧠 PRODUCT DATABASE (expand this later or load from JSON)
 */
const products = [
  {
    asin: "B08K2S1S2R",
    title: "Dyson V11 Vacuum",
    category: "vacuum"
  },
  {
    asin: "B07FNKNFJ9",
    title: "Breville Coffee Machine",
    category: "coffee"
  }
];

/**
 * 🔗 AMAZON LINK
 */
function productLink(asin) {
  return `/products/${asin}.html`;
}

/**
 * 🧱 HUB TEMPLATE (SILO PAGE)
 */
function buildHub(category, items) {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${category.toUpperCase()} Hub</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    body { font-family: Arial; margin:0; background:#f4f6f8; }
    .container { max-width: 900px; margin:auto; padding:20px; }
    .card {
      background:white;
      padding:15px;
      margin:10px 0;
      border-radius:10px;
      box-shadow:0 2px 6px rgba(0,0,0,0.08);
    }
    a.button {
      display:inline-block;
      padding:10px 14px;
      background:#2563eb;
      color:white;
      text-decoration:none;
      border-radius:6px;
    }
  </style>
</head>
<body>

<div class="container">

<h1>🔥 Best ${category.toUpperCase()} Products</h1>
<p>Top rated picks in the ${category} category.</p>
`;

  items.forEach(p => {
    html += `
      <div class="card">
        <h3>${p.title}</h3>
        <a class="button" href="${productLink(p.asin)}">
          View Product
        </a>
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
 * 📦 GROUP PRODUCTS BY CATEGORY
 */
function groupProducts() {
  const map = {};

  products.forEach(p => {
    if (!map[p.category]) map[p.category] = [];
    map[p.category].push(p);
  });

  return map;
}

/**
 * 🚀 GENERATE HUBS
 */
function generateHubs() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  const grouped = groupProducts();

  Object.keys(grouped).forEach(category => {
    const html = buildHub(category, grouped[category]);
    const filePath = path.join(OUTPUT_DIR, `${category}-hub.html`);

    fs.writeFileSync(filePath, html, "utf-8");

    console.log("🏗️ Hub created:", filePath);
  });

  console.log("✅ SEO SILO BUILD COMPLETE");
}

/**
 * 🚀 RUN
 */
generateHubs();
