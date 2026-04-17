const fs = require("fs");
const path = require("path");

/**
 * Load product database safely
 */
let PRODUCTS = [];
try {
  PRODUCTS = require("./products.js").PRODUCTS || [];
} catch (e) {
  console.warn("products.js not loaded, using empty list");
}

/**
 * OUTPUT FOLDER
 */
const OUTPUT_DIR = "./";

/**
 * SAFE SLUG GENERATOR
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * AMAZON LINK BUILDER
 */
function amazonLink(asin, tag) {
  if (!asin) return "#";
  return `https://www.amazon.com/dp/${asin}?tag=${tag}`;
}

/**
 * BUILD PRODUCT PAGE HTML
 */
function buildProductPage(product) {
  const link = amazonLink(product.asin, "brightlane201-20");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${product.name}</title>

  <meta name="description" content="${product.description}">
  <meta name="robots" content="index, follow">
</head>
<body style="font-family:Arial;padding:40px;">

  <h1>${product.name}</h1>

  <img src="${product.image}" style="max-width:400px;" />

  <p>${product.description}</p>

  <a href="${link}" target="_blank"
     style="display:inline-block;padding:15px;background:#ff9900;color:#000;text-decoration:none;">
     Buy on Amazon
  </a>

</body>
</html>
  `;
}

/**
 * AVOID DUPLICATES
 */
const usedAsins = new Set();

/**
 * GENERATE PRODUCT PAGES
 */
function generateProducts() {
  PRODUCTS.forEach((p) => {
    if (!p.asin || usedAsins.has(p.asin)) {
      console.log("Skipping duplicate or invalid ASIN:", p.asin);
      return;
    }

    usedAsins.add(p.asin);

    const filename = `${slugify(p.name)}.html`;
    const filePath = path.join(OUTPUT_DIR, filename);

    fs.writeFileSync(filePath, buildProductPage(p));

    console.log("Generated:", filename);
  });
}

/**
 * BUILD INDEX PAGE (simple safe fallback)
 */
function buildIndex() {
  const cards = PRODUCTS.map(p => {
    return `
      <div style="padding:15px;border:1px solid #ddd;margin:10px;">
        <h3>${p.name}</h3>
        <a href="${slugify(p.name)}.html">View Product</a>
      </div>
    `;
  }).join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Best Deals 2026</title>
</head>
<body style="font-family:Arial;padding:40px;">

  <h1>🔥 Best Amazon Deals</h1>

  ${cards}

</body>
</html>
  `;
}

/**
 * GENERATE INDEX
 */
function generateIndex() {
  fs.writeFileSync(path.join(OUTPUT_DIR, "index.html"), buildIndex());
  console.log("Index generated");
}

/**
 * RUN SYSTEM
 */
function run() {
  console.log("Starting SEO generation...");

  generateProducts();
  generateIndex();

  console.log("DONE");
}

run();
