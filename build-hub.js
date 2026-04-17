const fs = require("fs");
const path = require("path");

const { getAmazonLink } = require("./amazon-link");

const INPUT = path.join(__dirname, "products-source.json");
const OUTPUT = path.join(__dirname, "dist");

/**
 * 📦 LOAD PRODUCTS
 */
function loadProducts() {
  return JSON.parse(fs.readFileSync(INPUT, "utf-8"));
}

/**
 * 🧠 PRODUCT CARD HTML
 */
function productCard(p) {

  return `
  <div class="card">

    <img src="${p.image}" style="width:100%;border-radius:10px;" />

    <h3>${p.title}</h3>

    <p>⭐ ${p.rating || "4.5"}</p>
    <p>$${p.price || "N/A"}</p>

    <a href="/products/${p.asin}.html"
       style="display:block;padding:10px;background:#2563eb;color:white;text-align:center;border-radius:8px;text-decoration:none;">
       View Product
    </a>

    <a href="${getAmazonLink(p.asin)}"
       target="_blank"
       rel="nofollow sponsored"
       style="display:block;margin-top:5px;padding:10px;background:#f59e0b;color:black;text-align:center;border-radius:8px;text-decoration:none;">
       Buy on Amazon
    </a>

  </div>
  `;
}

/**
 * 🚀 BUILD INDEX PAGE
 */
function buildIndex(products) {

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Best Products Hub</title>
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

<h1>🔥 Best Affiliate Products</h1>

<div class="grid">

${products.map(productCard).join("")}

</div>

</body>
</html>
`;
}

/**
 * 🚀 RUN BUILDER
 */
function run() {

  if (!fs.existsSync(OUTPUT)) {
    fs.mkdirSync(OUTPUT, { recursive: true });
  }

  const products = loadProducts();

  const html = buildIndex(products);

  fs.writeFileSync(path.join(OUTPUT, "index.html"), html);

  console.log("✅ HUB + INDEX BUILT CORRECTLY");
}

run();
