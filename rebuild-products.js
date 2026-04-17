const fs = require("fs");
const path = require("path");

const { getAmazonLink } = require("./amazon-link");

const INPUT = path.join(__dirname, "products-source.json");
const OUTPUT_DIR = path.join(__dirname, "dist/products");

/**
 * 📦 LOAD PRODUCTS
 */
function loadProducts() {
  return JSON.parse(fs.readFileSync(INPUT, "utf-8"));
}

/**
 * 🧠 GENERATE PRODUCT HTML PAGE
 */
function buildProductPage(product) {

  const link = getAmazonLink(product.asin);

  return `
<!DOCTYPE html>
<html>
<head>
  <title>${product.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>

  <h1>${product.title}</h1>

  <img src="${product.image}" style="max-width:400px;" />

  <p>⭐ ${product.rating || "4.5"}</p>
  <p>$${product.price || "N/A"}</p>

  <a href="${link}"
     target="_blank"
     rel="nofollow sponsored">
     Buy on Amazon
  </a>

</body>
</html>
`;
}

/**
 * 🚀 BUILD ALL PRODUCTS
 */
function run() {

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const products = loadProducts();

  products.forEach(p => {

    const html = buildProductPage(p);

    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${p.asin}.html`),
      html
    );

    console.log("✅ Built:", p.asin);
  });

  console.log("🏁 ALL PRODUCT PAGES REBUILT WITH CORRECT LINKS");
}

run();
