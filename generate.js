const fs = require("fs");
const PRODUCTS = require("./products-data.json");
const AFFILIATE_TAG = "brightside20-20";

// ---------------------------
// VARIATION ENGINE
// ---------------------------
const intros = [
  (k) => `This guide breaks down the best options for ${k} based on real-world performance and value.`,
  (k) => `We compared top-rated products to find the best ${k} options available in 2026.`,
  (k) => `If you're looking for reliable ${k}, this comparison highlights the strongest choices.`,
];

const howWeChoose = [
  (c) => `We selected these ${c} products based on durability, performance, and user feedback.`,
  (c) => `Each ${c} product was evaluated for real-world usability and long-term reliability.`,
  (c) => `Our selection process focused on value, performance consistency, and build quality.`,
];

const faqs = [
  (k) => `
  <h3>FAQ</h3>
  <p><b>What is the best option for ${k}?</b> It depends on usage, but top-rated models provide the best balance of performance and value.</p>
  <p><b>Are premium versions worth it?</b> Yes, especially for long-term or heavy use scenarios.</p>
  `
];

// ---------------------------
// KEYWORD ENGINE (LONG TAIL)
// ---------------------------
function keywords(category) {
  const map = {
    solar: [
      "best solar panel for RV camping",
      "best portable solar generator for home backup",
      "best solar kit for off grid living"
    ],
    power: [
      "best power bank for international travel",
      "best fast charging power bank 2026",
      "best high capacity power bank for phones"
    ],
    survival: [
      "best survival kit for emergencies 2026",
      "best bug out bag essentials",
      "best disaster preparedness kit"
    ],
    electronics: [
      "best portable electronics for travel",
      "best tech gadgets for outdoor use",
      "best travel electronics gear 2026"
    ]
  };
  return map[category] || [`best ${category} products`];
}

// ---------------------------
// PRODUCT BLOCK (CONVERSION FOCUSED)
// ---------------------------
function productBlock(p, i) {
  const labels = ["Best Overall", "Best Value", "Premium Pick"];

  return `
  <div style="margin-bottom:40px;padding-bottom:20px;border-bottom:1px solid #eee;">

    ${i < 3 ? `<div style="background:#ff9900;color:#fff;padding:6px 10px;display:inline-block;border-radius:6px;">🔥 ${labels[i]}</div>` : ""}

    <h2>${p.title}</h2>
    <img src="${p.image}" width="260"/>

    <p>${p.description}</p>

    <a href="https://www.amazon.com/dp/${p.asin}?tag=${AFFILIATE_TAG}"
       target="_blank"
       style="display:inline-block;padding:12px 16px;background:#ff9900;color:#fff;border-radius:8px;">
       View Deal
    </a>

  </div>
  `;
}

// ---------------------------
// PAGE BUILDER
// ---------------------------
function buildPage(category, items) {
  const kw = keywords(category)[0];
  const intro = intros[Math.floor(Math.random() * intros.length)](kw);
  const how = howWeChoose[Math.floor(Math.random() * howWeChoose.length)](category);
  const faq = faqs[Math.floor(Math.random() * faqs.length)](kw);

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>${kw}</title>
    <meta name="description" content="${kw} comparison guide 2026">
  </head>

  <body style="font-family:Arial;max-width:900px;margin:auto;padding:20px;">

    <h1>${kw}</h1>

    <p>${intro}</p>

    <h2>How We Chose</h2>
    <p>${how}</p>

    ${items.map(productBlock).join("")}

    ${faq}

  </body>
  </html>
  `;
}

// ---------------------------
// RUN GENERATION
// ---------------------------
const grouped = {};

PRODUCTS.forEach(p => {
  if (!grouped[p.category]) grouped[p.category] = [];
  grouped[p.category].push(p);
});

Object.keys(grouped).forEach(cat => {
  fs.writeFileSync(`best-${cat}.html`, buildPage(cat, grouped[cat]));
  console.log("Generated:", cat);
});

console.log("🚀 NEXT GEN COMPLETE");
