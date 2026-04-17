const fs = require("fs");
const path = require("path");

/**
 * 🔥 BASE CONFIG
 */
const SITE_URL = "https://brightlane.github.io/shopppingonline";
const PRODUCTS_DIR = path.join(__dirname, "products");

/**
 * 🧠 SIMPLE PRODUCT MAP (can later be auto-loaded from JSON)
 */
const products = [
  { asin: "B08K2S1S2R", slug: "dyson-v11-vacuum", category: "vacuum" },
  { asin: "B07FNKNFJ9", slug: "breville-coffee-machine", category: "coffee" }
];

/**
 * 🔗 BUILD INTERNAL LINKS BLOCK
 */
function buildLinks(currentProduct) {
  const sameCategory = products.filter(
    p => p.category === currentProduct.category && p.asin !== currentProduct.asin
  );

  const otherProducts = products.filter(
    p => p.category !== currentProduct.category
  );

  let html = `
    <div style="margin-top:40px;padding:20px;background:#f9fafb;border-radius:12px;">
      <h3>🔗 Related Products</h3>
      <ul>
  `;

  sameCategory.forEach(p => {
    html += `<li><a href="/products/${p.asin}.html">More ${p.category} option</a></li>`;
  });

  otherProducts.slice(0, 3).forEach(p => {
    html += `<li><a href="/products/${p.asin}.html">Popular alternative</a></li>`;
  });

  html += `
      </ul>
    </div>
  `;

  return html;
}

/**
 * 🧱 INJECT LINKS INTO PRODUCT PAGE
 */
function injectLinks(filePath, product) {
  let html = fs.readFileSync(filePath, "utf-8");

  const linksBlock = buildLinks(product);

  // Inject before closing body
  html = html.replace("</body>", `${linksBlock}</body>`);

  fs.writeFileSync(filePath, html, "utf-8");

  console.log("🔗 Linked:", filePath);
}

/**
 * 🚀 RUN LINKING ENGINE
 */
function run() {
  products.forEach(product => {
    const filePath = path.join(PRODUCTS_DIR, `${product.asin}.html`);

    if (!fs.existsSync(filePath)) {
      console.log("⚠️ Missing file:", filePath);
      return;
    }

    injectLinks(filePath, product);
  });

  console.log("✅ Internal linking complete");
}

run();
