const fs = require("fs");
const path = require("path");

// =========================
// LOAD FEED
// =========================
const feedPath = path.join(__dirname, "../feed.json");

if (!fs.existsSync(feedPath)) {
  console.error("❌ feed.json not found. Run feeder.js first.");
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(feedPath, "utf-8"));

// =========================
// OUTPUT FOLDER
// =========================
const outputDir = path.join(__dirname, "../pages");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// =========================
// PAGE TEMPLATE
// =========================
function buildHTML(product) {
  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${product.title}</title>
  <meta name="description" content="Buy ${product.title} at the best price on Amazon.">
</head>

<body>
  <h1>${product.title}</h1>

  <img src="${product.image || ''}" alt="${product.title}" style="max-width:300px;" />

  <p><strong>Price:</strong> $${product.price}</p>
  <p><strong>Category:</strong> ${product.category}</p>
  <p><strong>Rating:</strong> ⭐ ${product.rating || "N/A"}</p>

  <a href="${product.affiliateLink}" target="_blank">
    🛒 Buy on Amazon
  </a>

  <hr>

  <p>ASIN: ${product.asin}</p>
</body>
</html>
`;
}

// =========================
// BUILD PAGES
// =========================
let count = 0;

for (const product of products) {
  const filePath = path.join(outputDir, `${product.asin}.html`);
  const html = buildHTML(product);

  fs.writeFileSync(filePath, html);
  count++;
}

// =========================
// DONE
// =========================
console.log("====================================");
console.log("✅ BUILD COMPLETE");
console.log("📄 Pages created:", count);
console.log("📁 Output folder:", outputDir);
console.log("====================================");
