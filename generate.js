const fs = require("fs");
const path = require("path");

// ===================== CONFIG =====================
const CONFIG = {
  affiliateTag: "brightlane201-20",
  siteName: "Best Products 2026",
  baseUrl: "https://brightlane.github.io/shopppingonline/",
  categories: [
    "vacuum-cleaners",
    "coffee-makers",
    "stanley-quencher-tumblers",
    "acne-patches",
    "ring-lights-for-phone"
  ]
};

// ===================== HELPERS =====================
function amazonLink(asin) {
  if (!asin || asin.length < 8) return null;
  return `https://www.amazon.com/dp/${asin}?tag=${CONFIG.affiliateTag}`;
}

function safeFileName(name) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

// Prevent duplicate ASINs
function dedupeProducts(products) {
  const seen = new Set();
  return products.filter(p => {
    if (!p.asin || seen.has(p.asin)) return false;
    seen.add(p.asin);
    return true;
  });
}

// ===================== SEO BLOCKS =====================
function generateSchema(product) {
  return `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "${product.title}",
  "description": "${product.description || ""}",
  "sku": "${product.asin}",
  "brand": {
    "@type": "Brand",
    "name": "${product.brand || "Amazon"}"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "${amazonLink(product.asin)}"
  }
}
</script>`;
}

function generateFAQ(category) {
  return `
<section style="max-width:900px;margin:40px auto;">
  <h2>FAQ - ${category}</h2>
  <details><summary>Are these the best ${category}?</summary>
  Yes, these are AI-ranked and updated for 2026.</details>

  <details><summary>Do Amazon links include affiliate tracking?</summary>
  Yes, all links include tracking ID ${CONFIG.affiliateTag}.</details>

  <details><summary>Do prices change?</summary>
  Yes, Amazon prices update frequently.</details>
</section>`;
}

// ===================== PAGE GENERATOR =====================
function generateProductPage(product, category) {
  const link = amazonLink(product.asin);

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${product.title}</title>
<meta name="description" content="${product.description}">

<!-- GOOGLE VERIFY (LOCKED - DO NOT REMOVE) -->
<meta name="google-site-verification" content="eWVDN3vbam9nnaZQu7wAQKyfmJJdM7zjI80l4DGeUrQ" />

<!-- BING VERIFY (LOCKED - DO NOT REMOVE) -->
<meta name="msvalidate.01" content="574044E39556B8B8DAAF1D1F233C87B0" />

<link rel="canonical" href="${CONFIG.baseUrl}${category}/${product.asin}.html">

<style>
body {font-family:system-ui;background:#f6f7fb;margin:0;padding:20px;}
.container {max-width:900px;margin:auto;background:white;padding:20px;border-radius:12px;}
a.button {display:inline-block;background:#111;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;}
a.button:hover {opacity:0.8;}
</style>

</head>
<body>

<div class="container">

<h1>${product.title}</h1>

<p>${product.description}</p>

<a class="button" href="${link}" target="_blank" rel="nofollow sponsored">
👉 View on Amazon
</a>

${generateSchema(product)}

</div>

${generateFAQ(category)}

</body>
</html>
`;
}

// ===================== MAIN =====================
function build() {
  const data = JSON.parse(fs.readFileSync("products-data.json", "utf8"));

  const cleanProducts = dedupeProducts(data.products || []);

  for (const category of CONFIG.categories) {
    const categoryDir = path.join(__dirname, "dist", category);
    fs.mkdirSync(categoryDir, { recursive: true });

    const products = cleanProducts.filter(p => p.category === category);

    for (const product of products) {
      const filePath = path.join(categoryDir, `${product.asin}.html`);
      fs.writeFileSync(filePath, generateProductPage(product, category));
    }
  }

  console.log("✅ Build complete - no duplicate ASINs, SEO locked, links fixed");
}

build();
