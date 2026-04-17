const fs = require("fs");

// YOUR TAG
const AFFILIATE_TAG = "brightside20-20";

// LOAD PRODUCTS
const PRODUCTS = require("./products-data.json");

// GROUP BY CATEGORY
const categories = {};

PRODUCTS.forEach(p => {
  if (!categories[p.category]) {
    categories[p.category] = [];
  }
  categories[p.category].push(p);
});

// GENERATE PAGE
function generatePage(category, items) {
  const title = `Best ${category} Products (2026)`;

  const productHTML = items.map(p => `
    <div class="product">
      <h2>${p.title}</h2>
      <img src="${p.image}" width="200"/>
      <p>${p.description}</p>
      <a href="https://www.amazon.com/dp/${p.asin}?tag=${AFFILIATE_TAG}" target="_blank">
        View on Amazon
      </a>
    </div>
  `).join("");

  return `
  <html>
  <head>
    <title>${title}</title>
  </head>
  <body>

  <h1>${title}</h1>
  <p>Top rated ${category} products you can buy right now.</p>

  ${productHTML}

  </body>
  </html>
  `;
}

// WRITE FILES
Object.keys(categories).forEach(cat => {
  const html = generatePage(cat, categories[cat]);
  fs.writeFileSync(`best-${cat}.html`, html);
});

console.log("Pages generated 🚀");
