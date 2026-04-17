const fs = require("fs");
const path = require("path");

const PRODUCTS_FILE = path.join(__dirname, "products-source.json");
const OUTPUT_DIR = path.join(__dirname, "dist");

const AFFILIATE_TAG = "brightlane201-20";

/**
 * 🔗 STRICT AMAZON LINK BUILDER (PER PRODUCT ONLY)
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
 * 🧱 SAFE PRODUCT CARD
 */
function card(p) {

  // HARD SAFETY CHECK (prevents broken global ASIN bugs)
  if (!p.asin) {
    console.warn("❌ Missing ASIN for product:", p.title);
    return "";
  }

  return `
  <div class="card">

    <img 
      src="${p.image || 'https://via.placeholder.com/600x400?text=No+Image'}"
      style="width:100%;height:200px;object-fit:cover;border-radius:10px;"
    />

    <h3>${p.title}</h3>

    <p>⭐ ${p.rating || "4.5"}</p>
    <p>$${p.price || "N/A"}</p>

    <p style="font-size:12px;color:green;">
      ${p.category || "Product"}
    </p>

    <!-- INTERNAL PRODUCT PAGE -->
    <a href="/products/${p.asin}.html"
       style="display:block;padding:10px;background:#2563eb;color:white;text-align:center;border-radius:8px;text-decoration:none;">
       View Product
    </a>

    <!-- 🔥 STRICT PER-PRODUCT AMAZON LINK -->
    <a href="${amazonLink(p.asin)}"
       target="_blank"
       rel="nofollow sponsored"
       style="display:block;margin-top:5px;padding:10px;background:#f59e0b;color:black;text-align:center;border-radius:8px;text-decoration:none;">
       Buy on Amazon
    </a>

  </div>
  `;
}

/**
 * 🚀 BUILD HUB PAGE
 */
function buildHub(title, products) {

  return `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    body { font-family: Arial; padding:20px; background:#f5f6fa; }

    .grid {
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
      gap:20px;
    }

    .card {
      background:white;
      border-radius:12px;
      padding:15px;
      box-shadow:0 2px 10px rgba(0,0,0,0.08);
    }
  </style>
</head>

<body>

<h1>${title}</h1>

<div class="grid">
  ${products.map(card).join("")}
</div>

</body>
</html>
`;
}

/**
 * 🚀 RUN HUB BUILDER
 */
function run() {

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const products = loadProducts();

  const coffee = products.filter(p =>
    (p.category || "").toLowerCase().includes("coffee")
  );

  const html = buildHub("☕ Best Coffee Makers 2026", coffee);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "coffee-hub.html"),
    html
  );

  console.log("🏁 HUB BUILT WITH STRICT ASIN BINDING");
}

run();
