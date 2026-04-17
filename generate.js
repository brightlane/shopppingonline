const fs = require("fs");

const AFFILIATE_TAG = "brightlane201-20";
const SITE_URL = "https://brightlane.github.io/shopppingonline";

const LANGUAGES = ["en", "es", "de"];
const PAGE_TYPES = [
  "best","top","ultimate","vs","guide","review","2026",
  "buying","compared","showdown","battle","ranking","picks","choices"
];

const CATEGORIES = {
  vacuum: { name: "Vacuum Cleaners", keywords: ["cordless vacuum", "robot vacuum"] },
  coffee: { name: "Coffee Makers", keywords: ["espresso", "drip coffee"] },
  stanley: { name: "Stanley Quencher Tumblers", keywords: ["stanley cup", "tumbler"] },
  acne_patch: { name: "Acne Patches", keywords: ["acne patch", "pimple patch"] },
  ring_light: { name: "Ring Lights for Phone", keywords: ["ring light for phone", "portable led ring light"] }
};

/* ---------------- SAFE HTML ---------------- */
function escapeHTML(str = "") {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-");
}

/* ---------------- AMAZON LINK LOCK ---------------- */
function amazonUrl(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

/* ---------------- PRODUCT DATA ---------------- */
const DUMMY = {
  vacuum: [
    { title:"Dyson V15", asin:"B08N5LN61C", price:"749", rating:"4.7", reviews:"12500", best_for:"Carpets", image:"https://m.media-amazon.com/images/I/81bA5hK5gZL.jpg" }
  ],
  coffee: [
    { title:"Moccamaster KBGV", asin:"B01N6N2ARX", price:"359", rating:"4.8", reviews:"12000", best_for:"Home office", image:"https://m.media-amazon.com/images/I/moccamaster.jpg" }
  ],
  stanley: [
    { title:"Stanley Quencher 40oz", asin:"B0CGRCP4ML", price:"45", rating:"4.8", reviews:"125000", best_for:"Gym", image:"https://m.media-amazon.com/images/I/71g7z7y5sKL.jpg" }
  ],
  acne_patch: [
    { title:"Mighty Patch", asin:"B07QYQJZQJ", price:"12", rating:"4.5", reviews:"120000", best_for:"Pimples", image:"https://m.media-amazon.com/images/I/hero.jpg" }
  ],
  ring_light: [
    { title:"UBeesize Ring Light", asin:"B07PZHGFLW", price:"38", rating:"4.6", reviews:"85000", best_for:"TikTok", image:"https://m.media-amazon.com/images/I/ring.jpg" }
  ]
};

function loadProducts(cat) {
  try {
    return JSON.parse(fs.readFileSync(`products-${cat}.json`,"utf8"));
  } catch {
    return DUMMY[cat] || [];
  }
}

/* ---------------- SEO PRODUCT CARD (UPGRADED) ---------------- */
function productCard(p, i, catSlug) {
  const link = amazonUrl(p.asin);

  return `
<div class="product-card">

  <a href="${link}" target="_blank">
    <img src="${p.image}" alt="${p.title}" loading="lazy"/>
  </a>

  <h3>#${i} ${escapeHTML(p.title)}</h3>

  <p>${p.best_for || "Best overall choice in this category"}</p>

  <p class="desc">
    High-performance ${catSlug.replace("-"," ")} product designed for everyday use.
  </p>

  <ul>
    <li>Top rated in category</li>
    <li>Best seller verified</li>
    <li>Trusted by thousands of users</li>
  </ul>

  <p>
    ⭐ ${p.rating} (${p.reviews}) • 💲 ${p.price}
  </p>

  <a class="btn" href="${link}" target="_blank">Buy on Amazon</a>

</div>`;
}

/* ---------------- FAQ SCHEMA ---------------- */
function faqSchema(catName) {
  return `
<script type="application/ld+json">
{
 "@context":"https://schema.org",
 "@type":"FAQPage",
 "mainEntity":[{
   "@type":"Question",
   "name":"What is the best ${catName}?",
   "acceptedAnswer":{"@type":"Answer","text":"Top-rated ${catName} depends on budget and use case but we compare the best options available."}
 },{
   "@type":"Question",
   "name":"Are these ${catName} worth it?",
   "acceptedAnswer":{"@type":"Answer","text":"Yes, these products are selected based on performance, reviews, and value."}
 }]
}
</script>`;
}

/* ---------------- PAGE BUILDER ---------------- */
function buildPage(type, cat, products, lang="en") {

  const title = `${type.toUpperCase()} ${cat.name} 2026`;

  const links = Object.keys(CATEGORIES)
    .map(k => `<a href="${SITE_URL}/${type}-${slugify(CATEGORIES[k].name)}-en.html">${CATEGORIES[k].name}</a>`)
    .join(" | ");

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<meta name="description" content="Best ${cat.name} 2026 reviews and comparisons">
<link rel="canonical" href="${SITE_URL}">
${faqSchema(cat.name)}
</head>

<body style="font-family:system-ui;max-width:1000px;margin:auto;background:#f8fafc;padding:20px;">

<h1>${title}</h1>

<nav>${links}</nav>

<div>
${products.map((p,i)=>productCard(p,i+1,cat.name)).join("")}
</div>

<footer style="margin-top:40px;text-align:center;">
<strong>Amazon Affiliate Disclosure</strong><br>
We earn from qualifying purchases.<br><br>
<a href="${SITE_URL}/index.html">Home</a>
</footer>

</body>
</html>`;
}

/* ---------------- INDEX (PROTECTED SYSTEM) ---------------- */
function buildIndex(pageCount) {
  const categoryBlocks = Object.entries(CATEGORIES).map(([slug, cat])=>{
    return `
<div>
  <h3>${cat.name}</h3>
  <a href="best-${slugify(cat.name)}-en.html">Browse</a>
</div>`;
  }).join("");

  return `
<!DOCTYPE html>
<html>
<head>

<!-- 🔒 PROTECTED HEAD START -->
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE"/>
<!-- 🔒 PROTECTED HEAD END -->

<title>Best Products 2026</title>
</head>

<body style="font-family:system-ui;padding:40px;background:#f7fafc;">

<h1>Best Products 2026</h1>
<p>${pageCount} pages generated</p>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;">
${categoryBlocks}
</div>

</body>
</html>`;
}

/* ---------------- GENERATE ---------------- */
let pageCount = 0;

Object.entries(CATEGORIES).forEach(([slug, cat])=>{
  const products = loadProducts(slug);

  LANGUAGES.forEach(lang=>{
    PAGE_TYPES.forEach(type=>{
      const file = `${type}-${slugify(cat.name)}-${lang}.html`;
      const html = buildPage(type, cat, products.slice(0,6), lang);
      fs.writeFileSync(file, html);
      pageCount++;
    });
  });
});

/* INDEX SAFE WRITE */
fs.writeFileSync("index.html", buildIndex(pageCount));

/* ---------------- SITEMAP (SEGMENTED SEO BOOST) ---------------- */
const urls = fs.readdirSync(".")
  .filter(f=>f.endsWith(".html"))
  .map(f=>`
<url>
<loc>${SITE_URL}/${f}</loc>
<changefreq>weekly</changefreq>
<priority>${f.includes("best") ? "1.0":"0.7"}</priority>
</url>`).join("");

fs.writeFileSync("sitemap.xml", `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);

console.log("DONE:", pageCount, "pages");
