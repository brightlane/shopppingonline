const fs = require("fs");

const PRODUCTS = require("./products-data.json");
const AFFILIATE_TAG = "brightside20-20";

// ----------------------------
// GROUP PRODUCTS BY CATEGORY
// ----------------------------
const categories = {};
PRODUCTS.forEach(p => {
  if (!categories[p.category]) categories[p.category] = [];
  categories[p.category].push(p);
});

// ----------------------------
// AI-STYLE INTRO VARIATIONS
// ----------------------------
function intro(category) {
  const variations = [
    `We analyzed the best ${category} products for 2026 based on performance, durability, and real user feedback.`,
    `Finding the right ${category} setup can be difficult, so we compared the top-performing options available today.`,
    `Below is a curated list of the highest-rated ${category} products designed for reliability and value.`,
  ];

  return `<p>${variations[Math.floor(Math.random() * variations.length)]}</p>`;
}

// ----------------------------
// SCORE SYSTEM (simulated “AI ranking”)
// ----------------------------
function score(index) {
  return Math.max(10 - index, 6); // top items rank higher
}

// ----------------------------
// PRODUCT CARD (WITH BADGE)
// ----------------------------
function productCard(p, index) {
  const topPick = index === 0
    ? `<div style="background:#ff9900;color:#fff;padding:5px 10px;display:inline-block;border-radius:6px;">🔥 Top Pick</div>`
    : "";

  return `
    <div style="margin-bottom:35px;border-bottom:1px solid #eee;padding-bottom:20px;">
      ${topPick}
      <h2>${p.title}</h2>
      <img src="${p.image}" width="250"/>

      <p>${p.description}</p>

      <p><strong>Score:</strong> ${score(index)}/10</p>

      <a href="https://www.amazon.com/dp/${p.asin}?tag=${AFFILIATE_TAG}"
         target="_blank"
         style="display:inline-block;padding:12px 16px;background:#ff9900;color:#fff;border-radius:8px;text-decoration:none;">
         Check Price on Amazon
      </a>
    </div>
  `;
}

// ----------------------------
// COMPARISON TABLE (HIGH CONVERSION)
// ----------------------------
function comparisonTable(items) {
  let rows = items.map((p, i) => `
    <tr>
      <td>${p.title}</td>
      <td>${score(i)}/10</td>
      <td><a href="https://www.amazon.com/dp/${p.asin}?tag=${AFFILIATE_TAG}">View</a></td>
    </tr>
  `).join("");

  return `
    <h2>Quick Comparison</h2>
    <table border="1" cellpadding="10" cellspacing="0" style="width:100%;margin-bottom:30px;">
      <tr>
        <th>Product</th>
        <th>Rating</th>
        <th>Link</th>
      </tr>
      ${rows}
    </table>
  `;
}

// ----------------------------
// INTERNAL LINKS (SEO BOOST)
// ----------------------------
function internalLinks(current) {
  const links = Object.keys(categories)
    .filter(c => c !== current)
    .map(c => `<li><a href="best-${c}.html">Best ${c} Products</a></li>`)
    .join("");

  return `
    <h3>Explore More Categories</h3>
    <ul>${links}</ul>
  `;
}

// ----------------------------
// PAGE GENERATOR
// ----------------------------
function page(category, items) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Best ${category} Products 2026</title>
    <meta name="description" content="Top ${category} products selected for performance and value in 2026.">
  </head>

  <body style="font-family:Arial;max-width:900px;margin:auto;padding:20px;">

    <h1>Best ${category} Products (2026)</h1>

    ${intro(category)}

    ${comparisonTable(items)}

    ${items.map((p, i) => productCard(p, i)).join("")}

    ${internalLinks(category)}

  </body>
  </html>
  `;
}

// ----------------------------
// GENERATE FILES
// ----------------------------
Object.keys(categories).forEach(cat => {
  fs.writeFileSync(`best-${cat}.html`, page(cat, categories[cat]));
  console.log("Created:", cat);
});

console.log("DONE - HIGH QUALITY MODE");
const fs = require("fs");

const PRODUCTS = require("./products-data.json");
const AFFILIATE_TAG = "brightside20-20";

// -------------------------
// KEYWORD ENGINE (REAL SEO)
// -------------------------
function buildKeywords(category) {
  return [
    `best ${category} products 2026`,
    `best ${category} for beginners`,
    `top rated ${category} gear`,
    `best ${category} for value`,
  ];
}

// -------------------------
// SEO INTRO (VARIED BUT STRUCTURED)
// -------------------------
function intro(keyword) {
  return `
  <p>
    This guide covers <strong>${keyword}</strong> based on performance, reliability, and real-world use cases.
    We analyzed top-rated options to help you choose the right product without wasting time or money.
  </p>
  `;
}

// -------------------------
// PRODUCT ANALYSIS BLOCK
// -------------------------
function productBlock(p, index) {
  const badge = index === 0
    ? `<div style="background:#ff9900;color:#fff;padding:6px 10px;display:inline-block;border-radius:6px;">🔥 Best Choice</div>`
    : "";

  return `
  <div style="margin-bottom:40px;border-bottom:1px solid #eee;padding-bottom:20px;">
    ${badge}
    <h2>${p.title}</h2>
    <img src="${p.image}" width="250"/>

    <p>${p.description}</p>

    <p><strong>Why it stands out:</strong> Strong balance of performance, durability, and value in its category.</p>

    <a href="https://www.amazon.com/dp/${p.asin}?tag=${AFFILIATE_TAG}"
       target="_blank"
       style="display:inline-block;padding:12px 16px;background:#ff9900;color:#fff;border-radius:8px;">
       Check Price
    </a>
  </div>
  `;
}

// -------------------------
// FAQ GENERATOR (SEO BOOST)
// -------------------------
function faq(category) {
  return `
  <h2>Frequently Asked Questions</h2>

  <h4>What is the best ${category} right now?</h4>
  <p>The best option depends on your use case, but top-rated models offer a balance of reliability and efficiency.</p>

  <h4>Are expensive ${category} products worth it?</h4>
  <p>Higher-priced options usually offer better durability and performance, especially for long-term use.</p>
  `;
}

// -------------------------
// INTERNAL LINK NETWORK
// -------------------------
function links(category) {
  const cats = ["solar", "power", "survival", "electronics"];

  return `
  <h3>Related Guides</h3>
  <ul>
    ${cats.filter(c => c !== category).map(c =>
      `<li><a href="best-${c}.html">Best ${c} guide</a></li>`
    ).join("")}
  </ul>
  `;
}

// -------------------------
// PAGE BUILDER
// -------------------------
function page(category, items) {
  const keywords = buildKeywords(category);
  const keyword = keywords[0];

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>${keyword}</title>
    <meta name="description" content="${keyword} reviewed and compared for 2026">
  </head>

  <body style="font-family:Arial;max-width:900px;margin:auto;padding:20px;">

    <h1>${keyword}</h1>

    ${intro(keyword)}

    ${items.map((p, i) => productBlock(p, i)).join("")}

    ${faq(category)}

    ${links(category)}

  </body>
  </html>
  `;
}

// -------------------------
// GENERATE ALL PAGES
// -------------------------
const categories = {};

PRODUCTS.forEach(p => {
  if (!categories[p.category]) categories[p.category] = [];
  categories[p.category].push(p);
});

Object.keys(categories).forEach(cat => {
  fs.writeFileSync(`best-${cat}.html`, page(cat, categories[cat]));
  console.log("Generated:", cat);
});

console.log("LEVEL 3 SEO ENGINE COMPLETE");
