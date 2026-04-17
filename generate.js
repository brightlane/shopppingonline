const fs = require("fs");
const path = require("path");

// ================= CONFIG =================
const CONFIG = {
  affiliateTag: "brightlane201-20",
  baseUrl: "https://brightlane.github.io/shopppingonline/",
  categories: [
    "vacuum-cleaners",
    "coffee-makers",
    "stanley-quencher-tumblers",
    "acne-patches",
    "ring-lights-for-phone"
  ]
};

// ================= HELPERS =================
function amazonLink(asin) {
  if (!asin || typeof asin !== "string") return null;
  if (!/^[A-Z0-9]{10}$/.test(asin)) return null;

  return `https://www.amazon.com/dp/${asin}?tag=${CONFIG.affiliateTag}`;
}

function dedupe(products) {
  const seen = new Set();
  return products.filter(p => {
    if (!p.asin || seen.has(p.asin)) return false;
    seen.add(p.asin);
    return true;
  });
}

// ================= PAGE =================
function buildPage(product, category) {
  const link = amazonLink(product.asin);

  if (!link) {
    console.log("❌ Skipping invalid ASIN:", product.asin);
    return "";
  }

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${product.title}</title>

<meta name="google-site-verification" content="eWVDN3vbam9nnaZQu7wAQKyfmJJdM7zjI80l4DGeUrQ">
<meta name="msvalidate.01" content="574044E39556B8B8DAAF1D1F233C87B0">

</head>
<body>

<h1>${product.title}</h1>
<p>${product.description || ""}</p>

<a href="${link}" target="_blank" rel="nofollow sponsored">
Buy on Amazon
</a>

</body>
</html>
`;
}

// ================= MAIN =================
function run() {
  const data = JSON.parse(fs.readFileSync("products-data.json", "utf8"));

  const products = dedupe(data.products || []);

  for (const p of products) {
    const cat = p.category || "uncategorized";

    const dir = path.join(__dirname, "dist", cat);
    fs.mkdirSync(dir, { recursive: true });

    const file = path.join(dir, `${p.asin}.html`);
    fs.writeFileSync(file, buildPage(p, cat));
  }

  console.log("✅ generate.js fixed and running clean");
}

run();
