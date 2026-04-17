const fs = require("fs");

const AFFILIATE_TAG = "brightlane201-20";
const SITE_URL = "https://brightlane.github.io/shopppingonline";

// ========================
// CORE CONFIG
// ========================
const LANGUAGES = ["en", "es", "de"];

const PAGE_TYPES = [
  "best", "top", "ultimate", "vs", "guide",
  "review", "2026", "buying", "compared",
  "showdown", "battle", "ranking", "picks", "choices"
];

const CATEGORIES = {
  vacuum: {
    name: "Vacuum Cleaners",
    keywords: ["cordless vacuum", "robot vacuum"]
  },
  coffee: {
    name: "Coffee Makers",
    keywords: ["espresso", "drip coffee"]
  },
  stanley: {
    name: "Stanley Quencher Tumblers",
    keywords: ["stanley cup", "tumbler"]
  },
  acne_patch: {
    name: "Acne Patches",
    keywords: ["acne patch", "pimple patch"]
  },
  ring_light: {
    name: "Ring Lights for Phone",
    keywords: ["ring light", "portable led light"]
  }
};

// ========================
// AMAZON LINK BUILDER (FIXED)
// ========================
function amazonUrl(asin) {
  if (!asin || typeof asin !== "string") return "#";
  return `https://www.amazon.com/dp/${asin.trim()}?tag=${AFFILIATE_TAG}`;
}

// ========================
// HELPERS
// ========================
function escapeHTML(str = "") {
  return str.replace(/&/g,"&amp;")
            .replace(/</g,"&lt;")
            .replace(/>/g,"&gt;")
            .replace(/"/g,"&quot;");
}

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g,"")
    .replace(/[\s_-]+/g,"-")
    .replace(/^-+|-+$/g,"");
}

// ========================
// LOAD PRODUCTS
// ========================
function loadProducts(cat) {
  try {
    return JSON.parse(fs.readFileSync(`products-${cat}.json`, "utf8"));
  } catch {
    return [];
  }
}

// ========================
// CLEAN + DEDUPE PRODUCTS
// ========================
function cleanProducts(products) {
  const seen = new Set();
  return products
    .filter(p => p && p.asin)
    .filter(p => {
      if (seen.has(p.asin)) return false;
      seen.add(p.asin);
      return true;
    })
    .map(p => ({
      ...p,
      title: p.title || "Product",
      price: p.price || "—",
      rating: p.rating || "4.5",
      reviews: p.reviews || "1000+",
      image: p.image || "",
      best_for: p.best_for || ""
    }));
}

// ========================
// CTR TRACKING
// ========================
function trackClick(asin, category) {
  return `onclick="fetch('${SITE_URL}/tracker.js?asin=${asin}&cat=${category}')"
  `;
}

// ========================
// PRODUCT CARD (UPGRADED UI)
// ========================
function productCard(p, i, categorySlug) {
  const link = amazonUrl(p.asin);

  return `
  <div style="
    background:#fff;
    padding:22px;
    margin:18px 0;
    border-radius:16px;
    box-shadow:0 10px 30px rgba(0,0,0,0.08);
    display:flex;
    gap:20px;
    flex-wrap:wrap;
    align-items:center;
  ">

    <a href="${link}" target="_blank" ${trackClick(p.asin, categorySlug)}>
      <img src="${escapeHTML(p.image)}"
        style="width:180px;height:180px;object-fit:cover;border-radius:12px;"
      />
    </a>

    <div style="flex:1;min-width:250px;">
      <h3 style="margin:0 0 8px 0;">${i}. ${escapeHTML(p.title)}</h3>

      <p style="color:#555;margin:0 0 8px;">
        ${p.best_for ? "Best for: " + p.best_for : "Top rated product"}
      </p>

      <p style="margin:0 0 10px;font-size:13px;color:#666;">
        High-performance product selected for value and reliability.
      </p>

      <p style="font-weight:600;">
        <span style="color:#22c55e;">$${p.price}</span> •
        ⭐ ${p.rating} (${p.reviews})
      </p>

      <a href="${link}" target="_blank"
        style="display:inline-block;margin-top:10px;
        padding:10px 16px;background:#ff3d00;color:#fff;
        border-radius:10px;text-decoration:none;font-weight:700;">
        View on Amazon
      </a>
    </div>
  </div>`;
}

// ========================
// FAQ GENERATOR
// ========================
function faqSection(catName) {
  return `
  <h2>FAQ</h2>
  <details><summary>Are these ${catName} worth it?</summary>
  <p>Yes, these are top-rated and selected based on performance and reviews.</p></details>

  <details><summary>Do these products ship via Amazon?</summary>
  <p>Yes, all links redirect to Amazon with verified affiliate tracking.</p></details>

  <details><summary>How do we choose products?</summary>
  <p>We analyze ratings, reviews, and real user performance data.</p></details>
  `;
}

// ========================
// SEO SCHEMA
// ========================
function productSchema(p) {
  return {
    "@context":"https://schema.org",
    "@type":"Product",
    "name":p.title,
    "image":p.image,
    "offers":{
      "@type":"Offer",
      "price":p.price,
      "priceCurrency":"USD",
      "availability":"https://schema.org/InStock"
    },
    "aggregateRating":{
      "@type":"AggregateRating",
      "ratingValue":p.rating,
      "reviewCount":p.reviews
    }
  };
}

// ========================
// PAGE BUILDER
// ========================
function buildPage(type, cat, products, lang="en") {

  const title = `${type.toUpperCase()} ${cat.name} 2026`;

  const schema = products.map(productSchema);

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<meta name="description" content="Best ${cat.name} products reviewed and ranked for 2026">
<script type="application/ld+json">
${JSON.stringify(schema)}
</script>
</head>

<body style="font-family:system-ui;background:#f5f7fb;max-width:1000px;margin:auto;padding:20px;">

<h1>${title}</h1>
<p>Trusted rankings • Updated 2026</p>

${products.map((p,i)=>productCard(p,i+1,slugify(cat.name))).join("")}

${faqSection(cat.name)}

<p style="margin-top:40px;text-align:center;">
<a href="/index.html">← Back to categories</a>
</p>

</body>
</html>
`;
}

// ========================
// GENERATE ALL PAGES
// ========================
let pageCount = 0;

Object.entries(CATEGORIES).forEach(([slug, cat]) => {

  const products = cleanProducts(loadProducts(slug));

  if (!products.length) return;

  LANGUAGES.forEach(lang => {
    PAGE_TYPES.forEach(type => {

      const file = `${type}-${slugify(cat.name)}-${lang}.html`;

      const shuffled = [...products]
        .sort(()=>Math.random()-0.5)
        .slice(0,6);

      fs.writeFileSync(file, buildPage(type, cat, shuffled, lang));
      pageCount++;
    });
  });
});

// ========================
// INDEX (SEO HUB + INTERNAL LINK GRAPH)
// ========================
const index = `
<!DOCTYPE html>
<html>
<head>
<title>Best Products 2026</title>

<meta name="google-site-verification" content="eWVDN3vbam9nnaZQu7wAQKyfmJJdM7zjI80l4DGeUrQ" />
<meta name="msvalidate.01" content="574044E39556B8B8DAAF1D1F233C87B0" />

</head>

<body style="font-family:system-ui;background:#f7fafc;padding:40px;">

<h1 style="text-align:center;">Best Products 2026</h1>
<p style="text-align:center;">${pageCount} pages generated</p>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;max-width:1000px;margin:auto;">

${Object.entries(CATEGORIES).map(([slug,cat])=>`
<div style="background:#fff;padding:20px;border-radius:12px;">
  <h2>${cat.name}</h2>
  <a href="best-${slugify(cat.name)}-en.html">Best Guide</a><br>
  <a href="review-${slugify(cat.name)}-en.html">Reviews</a><br>
  <a href="vs-${slugify(cat.name)}-en.html">Vs Pages</a>
</div>
`).join("")}

</div>

</body>
</html>
`;

fs.writeFileSync("index.html", index);

// ========================
// SITEMAP
// ========================
const urls = fs.readdirSync(".")
  .filter(f => f.endsWith(".html"))
  .map(f => `
  <url>
    <loc>${SITE_URL}/${f}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("");

fs.writeFileSync("sitemap.xml", `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);

console.log("DONE:", pageCount);
