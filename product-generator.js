const fs = require("fs");
const path = require("path");

/**
 * 🔥 AMAZON AFFILIATE TAG
 */
const AFFILIATE_TAG = "brightlane201-20";

/**
 * 🧠 PRODUCT DATABASE (you expand this list)
 */
const products = [
  {
    asin: "B08K2S1S2R",
    title: "Dyson V11 Cordless Vacuum",
    description:
      "High-performance cordless vacuum for deep cleaning carpets, pet hair, and hard floors.",
    image: "https://m.media-amazon.com/images/I/71V--WZVUIL._AC_SL1500_.jpg"
  },
  {
    asin: "B07FNKNFJ9",
    title: "Breville Barista Express Coffee Machine",
    description:
      "Professional espresso machine with built-in grinder for café-quality coffee at home.",
    image: "https://m.media-amazon.com/images/I/61i8v3+K7dL._AC_SL1500_.jpg"
  }
];

/**
 * 🔗 AMAZON LINK BUILDER
 */
function amazonLink(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

/**
 * 🧱 PRODUCT PAGE TEMPLATE
 */
function buildProductPage(product) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${product.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      background: #f5f6fa;
      color: #111;
    }

    .container {
      max-width: 900px;
      margin: auto;
      padding: 30px;
      background: white;
    }

    img {
      width: 100%;
      border-radius: 12px;
    }

    h1 {
      font-size: 28px;
    }

    p {
      color: #444;
      line-height: 1.6;
    }

    .buy-btn {
      display: inline-block;
      margin-top: 20px;
      padding: 14px 18px;
      background: #ff9900;
      color: black;
      font-weight: bold;
      text-decoration: none;
      border-radius: 8px;
    }

    .buy-btn:hover {
      background: #e68a00;
    }

    .back {
      display: inline-block;
      margin-top: 20px;
      color: #555;
      text-decoration: none;
    }
  </style>
</head>

<body>

  <div class="container">

    <a class="back" href="../index.html">← Back to Home</a>

    <h1>${product.title}</h1>

    <img src="${product.image}" alt="${product.title}">

    <p>${product.description}</p>

    <a class="buy-btn"
       href="${amazonLink(product.asin)}"
       target="_blank"
       rel="nofollow sponsored noopener">
       Buy on Amazon
    </a>

  </div>

</body>
</html>`;
}

/**
 * 📦 GENERATE ALL PRODUCT PAGES
 */
function generateProducts() {
  const outputDir = path.join(__dirname, "products");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  products.forEach(product => {
    const filePath = path.join(outputDir, `${product.asin}.html`);
    const html = buildProductPage(product);

    fs.writeFileSync(filePath, html, "utf-8");

    console.log("✅ Generated:", filePath);
  });
}

/**
 * 🚀 RUN GENERATOR
 */
generateProducts();
