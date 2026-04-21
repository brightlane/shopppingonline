const fs = require("fs");
const path = require("path");

// =========================
// LOAD DATA
// =========================
const feedPath = path.join(__dirname, "../feed.json");
const pagesDir = path.join(__dirname, "../pages");

if (!fs.existsSync(feedPath)) {
  console.error("❌ feed.json missing");
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(feedPath, "utf-8"));

// =========================
// BUILD PRODUCT MAP
// =========================
const productMap = {};
products.forEach(p => {
  productMap[p.asin] = p;
});

// =========================
// GET RANDOM RELATED PRODUCTS
// =========================
function getRelated(currentAsin, limit = 3) {
  const shuffled = products
    .filter(p => p.asin !== currentAsin)
    .sort(() => 0.5 - Math.random());

  return shuffled.slice(0, limit);
}

// =========================
// ENHANCE EACH HTML PAGE
// =========================
for (const product of products) {
  const filePath = path.join(pagesDir, `${product.asin}.html`);

  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, "utf-8");

  const related = getRelated(product.asin);

  let relatedHTML = `<h3>Related Products</h3><ul>`;

  related.forEach(r => {
    relatedHTML += `
      <li>
        <a href="./${r.asin}.html">${r.title}</a>
      </li>
    `;
  });

  relatedHTML += `</ul>`;

  // Inject before closing body
  html = html.replace("</body>", `${relatedHTML}</body>`);

  fs.writeFileSync(filePath, html);
}

console.log("====================================");
console.log("✅ INTERNAL LINKING COMPLETE");
console.log("🔗 Pages enhanced with related products");
console.log("====================================");
