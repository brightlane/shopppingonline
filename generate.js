const fs = require("fs");
const PRODUCTS = require("./products-data.json");

const AFFILIATE_TAG = "brightside20-20";

// ---------------------------
// VARIATION ENGINE (AI-STYLE TEMPLATES)
// ---------------------------
const intros = [
  (k) =>
    `This guide breaks down the best options for ${k} based on real-world performance, durability, and overall value.`,
  (k) =>
    `We compared the top-rated products to find the best ${k} options available in 2026.`,
  (k) =>
    `If you're looking for reliable ${k}, this comparison highlights the strongest performing choices right now.`,
];

const howWeChoose = [
  (c) =>
    `We selected these ${c} products based on durability, performance, value for money, and real user feedback.`,
  (c) =>
    `Each ${c} product was evaluated based on real-world usage, reliability, and long-term performance.`,
  (c) =>
    `Our selection process focused on quality, consistency, and overall customer satisfaction.`,
];

const faqs = [
  (k) => `
  <h2>FAQ</h2>

  <p><b>What is the best option for ${k}?</b> It depends on your needs, but top-rated models offer the best balance of performance and price.</p>

  <p><b>Are expensive options worth it?</b> Yes, premium versions usually last longer and perform better under heavy use.</p>
  `,
];

// ---------------------------
// KEYWORD ENGINE (SEO LONG-TAIL)
// ---------------------------
function keywords(category) {
  const map = {
    solar: [
      "best solar panel for RV camping",
      "best portable solar generator for home backup",
      "best solar kit for off grid living",
    ],
    power: [
      "best power bank for international travel",
      "best fast charging power bank 2026",
      "best high capacity power bank for phones",
    ],
    survival: [
      "best survival kit for emergencies 2026",
      "best bug out bag essentials",
      "best disaster preparedness kit",
    ],
    electronics: [
      "best portable electronics for travel",
      "best tech gadgets for outdoor use",
      "best travel electronics gear 2026",
    ],
  };

  return map[category] || [`best ${category} products 2026`];
}

// ---------------------------
// PRODUCT BLOCK (CONVERSION OPTIMIZED)
// ---------------------------
function productBlock(p, i) {
  const labels = ["🔥 Best Overall", "💰 Best Value", "⭐ Premium Pick"];

  return `
  <div style="margin-bottom:40px;padding-bottom:20px;border-bottom:1px solid #eee;">

    ${
      i < 3
        ? `<div style="background:#ff9900;color:#fff;padding:6px 10px;display:inline-block;border-radius:6px;font-weight:bold;">
            ${labels[i]}
           </div>`
        : ""
    }

    <h2>${p.title}</h2>

    <img src="${p.image}" width="260" style="border-radius:8px;" />

    <p>${p.description}</p>

    <a href="https://www.amazon.com/dp/${p.asin}?tag=${AFFILIATE_TAG}"
       target="_blank"
       style="display:inline-block;margin-top:10px;padding:12px 16px;background:#ff9900;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
       Check Price on Amazon
    </a>

  </div>
  `;
}

// ---------------------------
// PAGE BUILDER
// ---------------------------
function buildPage(category, items) {
  const kwList = keywords(category);
  const kw = kwList[0] || `best ${category} products 2026`;

  const intro = intros[Math.floor(Math.random() * intros.length)](kw);
  const how =
    howWeChoose[Math.floor(Math.random() * howWeChoose.length)](category);
  const faq = faqs[Math.floor(Math.random() * faqs.length)](kw);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${kw}</title>
  <meta name="description" content="${kw} - expert comparison and buying guide for 2026">
</head>

<body style="font-family:Arial;background:#f7f7f7;max-width:900px;margin:auto;padding:20px;">

  <h1>${kw}</h1>

  <p>${intro}</p>

  <h2>How We Chose These Products</h2>
  <p>${how}</p>

  ${items.map(productBlock).join("")}

  ${faq}

</body>
</html>
`;
}

// ---------------------------
// GROUP PRODUCTS BY CATEGORY
// ---------------------------
const grouped = {};

for (const p of PRODUCTS) {
  if (!p.category) continue;

  if (!grouped[p.category]) grouped[p.category] = [];
  grouped[p.category].push(p);
}

// ---------------------------
// GENERATE FILES
// ---------------------------
for (const cat of Object.keys(grouped)) {
  const fileName = `best-${cat}.html`;
  const html = buildPage(cat, grouped[cat]);

  fs.writeFileSync(fileName, html);
  console.log("Generated:", fileName);
}

console.log("🚀 NEXT GEN COMPLETE - READY FOR SEO + AFFILIATE TRAFFIC");
