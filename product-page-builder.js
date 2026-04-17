const fs = require("fs");
const path = require("path");

const PRODUCTS_FILE = path.join(__dirname, "products-source.json");
const OUTPUT_DIR = path.join(__dirname, "dist/products");

const AFFILIATE_TAG = "brightlane201-20";

/**
 * 🔗 AMAZON LINK (SAFE + STRICT)
 */
function amazonLink(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

/**
 * 📦 LOAD PRODUCTS
 */
function loadProducts() {
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
}

/**
 * 🧱 PRODUCT PAGE TEMPLATE
 */
function buildPage(p) {

  if (!p.asin) {
    console.warn("❌ Missing ASIN:", p.title);
    return "";
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <title>${p.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    body {
      font-family: Arial;
      padding: 20px;
      background: #f5f6fa;
    }

    .box {
      max-width: 700px;
      margin: auto;
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }

    img {
      width: 100%;
      border-radius: 10px;
    }

    .btn {
      display: block;
      margin-top: 20px;
      padding: 12px;
      background: #f59e0b;
      color: black;
      text-align: center;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
    }

    .btn:hover {
      background: #e68a00;
    }
  </style>
</head>

<body>

<div class="box">

  <h1>${p.title}</h1>

  <img src="${p.image || 'https://via.placeholder.com/600x400?text=No+Image'}" />

  <p>⭐ ${p.rating || "4.5"} rating</p>
  <p>$${p.price || "N/A"}</p>

  <p>${p.description || "High-quality product selected for this category."}</p>

  <!-- STRICT AMAZON LINK -->
  <a class="btn"
     href="${amazonLink(p.asin)}"
     target="_blank"
     rel="nofollow sponsored">
     Buy on Amazon
  </a>

</div>

</body>
</html>
`;
}

/**
 * 🚀 BUILD ALL PRODUCT PAGES
 */
function run() {

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const products = loadProducts();

  products.forEach(p => {

    const html = buildPage(p);

    if (!html) return;

    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${p.asin}.html`),
      html
    );

    console.log("✅ Built product page:", p.asin);
  });

  console.log("🏁 ALL PRODUCT PAGES GENERATED");
}

run();
