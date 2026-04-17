const fs = require("fs");
const path = require("path");

const SOURCE = path.join(__dirname, "products-source.json");
const OUTPUT = path.join(__dirname, "dist");
const AFFILIATE_TAG = "brightlane201-20";

/**
 * 🔒 STRICT VALIDATION
 */
function isASIN(v) {
  return typeof v === "string" && /^[A-Z0-9]{10}$/.test(v);
}

function isImage(v) {
  return typeof v === "string" && v.startsWith("http");
}

/**
 * 📦 LOAD SOURCE
 */
function loadProducts() {
  if (!fs.existsSync(SOURCE)) {
    throw new Error("Missing products-source.json");
  }
  return JSON.parse(fs.readFileSync(SOURCE, "utf-8"));
}

/**
 * ❌ HARD FILTER (NO EXCEPTIONS)
 */
function validate(products) {
  const clean = [];

  for (const p of products) {
    if (!isASIN(p.asin)) {
      console.log("❌ Removed invalid ASIN:", p.asin);
      continue;
    }

    if (!p.title) {
      console.log("❌ Removed missing title:", p.asin);
      continue;
    }

    if (!isImage(p.image)) {
      console.log("❌ Removed missing image:", p.asin);
      continue; // IMPORTANT: we do NOT fallback anymore
    }

    clean.push(p);
  }

  return clean;
}

/**
 * 🔗 AMAZON LINK (ONLY VALID PATH)
 */
function amazonLink(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

/**
 * 🧱 PRODUCT PAGE (STRICT)
 */
function buildProduct(p) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${p.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

<h1>${p.title}</h1>

<img src="${p.image}" style="max-width:100%;border-radius:10px;" />

<a href="${amazonLink(p.asin)}"
   target="_blank"
   rel="nofollow sponsored">
   Buy on Amazon
</a>

</body>
</html>`;
}

/**
 * 🧱 HUB PAGE
 */
function buildHub(category, items) {
  let html = `<!doctype html>
<html>
<head>
  <title>${category}</title>
</head>
<body>

<h1>${category}</h1>
`;

  for (const p of items) {
    html += `
      <div>
        <h3>${p.title}</h3>
        <img src="${p.image}" style="max-width:300px;" />
        <br/>
        <a href="/dist/${p.asin}.html">View Product</a>
      </div>
    `;
  }

  html += `</body></html>`;
  return html;
}

/**
 * 🏠 INDEX
 */
function buildIndex(groups) {
  let html = `<h1>Store</h1><ul>`;

  for (const cat in groups) {
    html += `<li><a href="${cat}.html">${cat}</a></li>`;
  }

  html += `</ul>`;
  return html;
}

/**
 * 🚀 BUILD ENGINE
 */
function run() {
  if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT);

  const raw = loadProducts();
  const products = validate(raw);

  const groups = {};

  for (const p of products) {
    if (!groups[p.category]) groups[p.category] = [];
    groups[p.category].push(p);
  }

  // PRODUCT PAGES
  for (const p of products) {
    fs.writeFileSync(
      path.join(OUTPUT, `${p.asin}.html`),
      buildProduct(p)
    );
  }

  // HUBS
  for (const cat in groups) {
    fs.writeFileSync(
      path.join(OUTPUT, `${cat}.html`),
      buildHub(cat, groups[cat])
    );
  }

  // INDEX
  fs.writeFileSync(
    path.join(OUTPUT, "index.html"),
    buildIndex(groups)
  );

  console.log("✅ CLEAN BUILD COMPLETE (NO GUESSING ALLOWED)");
}

run();
