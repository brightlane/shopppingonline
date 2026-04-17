const fs = require("fs");

const PRODUCTS = require("./products-data.json");
const AFFILIATE_TAG = "brightside20-20";

// GROUP BY CATEGORY
const categories = {};

PRODUCTS.forEach(p => {
  if (!categories[p.category]) {
    categories[p.category] = [];
  }
  categories[p.category].push(p);
});

function intro(category) {
  return `
  <p>
    Best ${category} products for 2026. These picks are selected for performance, value, and reliability.
  </p>
  `;
}

function productCard(p) {
  return `
    <div style="margin-bottom:30px;">
      <h2>${p.title}</h2>
      <img src="${p.image}" width="250"/>
      <p>${p.description}</p>

      <a href="https://www.amazon.com/dp/${p.asin}?tag=${AFFILIATE_TAG}"
         target="_blank"
         style="display:inline-block;padding:10px 14px;background:#ff9900;color:#fff;text-decoration:none;border-radius:8px;">
         View on Amazon
      </a>
    </div>
  `;
}

function page(category, items) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Best ${category} Products</title>
    <meta name="description" content="Top ${category} products for 2026">
  </head>

  <body style="font-family:Arial;max-width:900px;margin:auto;padding:20px;">

    <h1>Best ${category} Products</h1>

    ${intro(category)}

    ${items.map(productCard).join("")}

  </body>
  </html>
  `;
}

Object.keys(categories).forEach(cat => {
  const file = `best-${cat}.html`;
  fs.writeFileSync(file, page(cat, categories[cat]));
  console.log("Created:", file);
});

console.log("DONE");
