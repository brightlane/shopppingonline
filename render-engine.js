const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "products-source.json");
const OUTPUT = path.join(__dirname, "dist");

const AFFILIATE_TAG = "brightlane201-20";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=No+Image";

/**
 * 🧠 HARD RULES (NO EXCEPTIONS)
 */
function validASIN(a) {
  return typeof a === "string" && /^[A-Z0-9]{10}$/.test(a);
}

function safeImage(img) {
  if (!img || typeof img !== "string") return FALLBACK_IMAGE;
  if (img.includes("undefined")) return FALLBACK_IMAGE;
  return img;
}

function amazonLink(asin) {
  if (!validASIN(asin)) return "#";

  const url = `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;

  return `/redirect.html?asin=${asin}&url=${encodeURIComponent(url)}`;
}

/**
 * 📦 LOAD DATA
 */
function load() {
  return JSON.parse(fs.readFileSync(INPUT, "utf-8"));
}

/**
 * 🧱 PRODUCT CARD (FINAL TRUTH)
 */
function card(p) {

  if (!validASIN(p.asin)) return "";

  return `
  <div class="card">

    <img src="${safeImage(p.image)}"
         onerror="this.src='${FALLBACK_IMAGE}'" />

    <h3>${p.title}</h3>

    <p>⭐ ${p.rating || "4.5"}</p>
    <p>$${p.price || "N/A"}</p>

    <a href="/products/${p.asin}.html" class="view">
      View Product
    </a>

    <a href="${amazonLink(p.asin)}"
       target="_blank"
       rel="nofollow sponsored"
       class="buy">
       Buy on Amazon
    </a>

  </div>
  `;
}

/**
 * 🧠 GROUP BY CATEGORY
 */
function group(products) {
  const map = {};

  products.forEach(p => {
    const cat = (p.category || "uncategorized").toLowerCase();

    if (!map[cat]) map[cat] = [];
    map[cat].push(p);
  });

  return map;
}

/**
 * 🧱 PAGE TEMPLATE
 */
function page(title, content) {
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

    img {
      width:100%;
      height:200px;
      object-fit:cover;
      border-radius:10px;
    }

    a {
      display:block;
      margin-top:8px;
      padding:10px;
      text-align:center;
      border-radius:8px;
      text-decoration:none;
    }

    .view { background:#2563eb; color:white; }
    .buy { background:#f59e0b; color:black; }
  </style>
</head>

<body>

<h1>${title}</h1>

<div class="grid">
${content}
</div>

</body>
</html>
`;
}

/**
 * 🚀 BUILD EVERYTHING (NO FRAGMENTS ANYMORE)
 */
function run() {

  if (!fs.existsSync(OUTPUT)) {
    fs.mkdirSync(OUTPUT, { recursive: true });
  }

  const products = load().filter(p => validASIN(p.asin));

  const grouped = group(products);

  // build category pages
  Object.keys(grouped).forEach(cat => {

    const html = page(
      `Best ${cat}`,
      grouped[cat].map(card).join("")
    );

    const file = cat.replace(/\s+/g, "-") + ".html";

    fs.writeFileSync(path.join(OUTPUT, file), html);

    console.log("✅ Built:", file);
  });

  // build index
  const all = page(
    "Best Products",
    products.map(card).join("")
  );

  fs.writeFileSync(path.join(OUTPUT, "index.html"), all);

  console.log("🏁 RENDER COMPLETE — SINGLE SOURCE OF TRUTH");
}

run();
