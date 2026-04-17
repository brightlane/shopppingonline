const fs = require("fs");
const path = require("path");

const PRODUCTS_FILE = path.join(__dirname, "products-source.json");
const OUTPUT_DIR = path.join(__dirname, "dist");

/**
 * 📦 LOAD PRODUCTS
 */
function loadProducts() {
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
}

/**
 * 🧠 GROUP BY CATEGORY
 */
function groupByCategory(products) {
  const map = {};

  products.forEach(p => {
    const cat = (p.category || "uncategorized").toLowerCase();

    if (!map[cat]) map[cat] = [];
    map[cat].push(p);
  });

  return map;
}

/**
 * 🧱 BUILD HUB PAGE
 */
function buildHub(category, products) {

  return `
<!DOCTYPE html>
<html>
<head>
  <title>${category.toUpperCase()}</title>
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

    img {
      width:100%;
      height:200px;
      object-fit:cover;
      border-radius:10px;
    }

    a {
      display:block;
      margin-top:8px;
      text-align:center;
      padding:10px;
      border-radius:8px;
      text-decoration:none;
    }

    .buy {
      background:#f59e0b;
      color:black;
    }

    .view {
      background:#2563eb;
      color:white;
    }
  </style>
</head>

<body>

<h1>🔥 Best ${category}</h1>

<div class="grid">

${products.map(p => `
  <div class="card">

    <img src="${p.image || 'https://via.placeholder.com/600x400?text=No+Image'}" />

    <h3>${p.title}</h3>

    <p>⭐ ${p.rating || "4.5"}</p>
    <p>$${p.price || "N/A"}</p>

    <a class="view" href="/products/${p.asin}.html">
      View Product
    </a>

    <a class="buy" href="https://www.amazon.com/dp/${p.asin}?tag=brightlane201-20"
       target="_blank"
       rel="nofollow sponsored">
      Buy on Amazon
    </a>

  </div>
`).join("")}

</div>

</body>
</html>
`;
}

/**
 * 🚀 RUN GENERATOR
 */
function run() {

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const products = loadProducts();
  const grouped = groupByCategory(products);

  Object.keys(grouped).forEach(category => {

    const safeName = category.replace(/\s+/g, "-").toLowerCase();

    const html = buildHub(category, grouped[category]);

    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${safeName}-hub.html`),
      html
    );

    console.log("✅ Built hub:", category);
  });

  console.log("🏁 ALL HUBS GENERATED AUTOMATICALLY");
}

run();
