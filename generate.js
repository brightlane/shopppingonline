const fs = require("fs");

/* =======================
   🔒 GLOBAL CONFIG LOCK
======================= */
const AFFILIATE_TAG = "brightlane201-20";
const SITE_URL = "https://brightlane.github.io/shopppingonline";

const GOOGLE_VERIFICATION = "eWVDN3vbam9nnaZQu7wAQKyfmJJdM7zjI80l4DGeUrQ";
const BING_VERIFICATION = "574044E39556B8B8DAAF1D1F233C87B0";

/* =======================
   SEO STRUCTURE ENGINE
======================= */
const LANGUAGES = ["en", "es", "de"];

const PAGE_TYPES = [
  "best","top","ultimate","review","guide","vs","ranking"
];

/* =======================
   CATEGORIES
======================= */
const CATEGORIES = {
  vacuum: {
    name: "Vacuum Cleaners",
    keywords: ["cordless vacuum","robot vacuum","stick vacuum"]
  },
  coffee: {
    name: "Coffee Makers",
    keywords: ["espresso machine","drip coffee maker","coffee grinder"]
  },
  stanley: {
    name: "Stanley Tumblers",
    keywords: ["stanley cup","insulated tumbler"]
  },
  acne_patch: {
    name: "Acne Patches",
    keywords: ["pimple patch","hydrocolloid patch"]
  },
  ring_light: {
    name: "Ring Lights",
    keywords: ["phone ring light","selfie light","tiktok lighting"]
  }
};

/* =======================
   SAFE HELPERS
======================= */
function escapeHTML(str=""){ 
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function slugify(str){
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-");
}

function amazonUrl(asin){
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

/* =======================
   DATA (SAFE FALLBACK)
======================= */
const DUMMY = {
  vacuum: [
    { title:"Dyson V15", asin:"B08N5LN61C", price:"749", rating:"4.7", reviews:"12500", best_for:"Deep cleaning", image:"https://m.media-amazon.com/images/I/81bA5hK5gZL.jpg" }
  ],
  coffee: [
    { title:"Moccamaster", asin:"B01N6N2ARX", price:"359", rating:"4.8", reviews:"12000", best_for:"Coffee lovers", image:"https://m.media-amazon.com/images/I/moccamaster.jpg" }
  ],
  stanley: [
    { title:"Stanley 40oz", asin:"B0CGRCP4ML", price:"45", rating:"4.8", reviews:"125000", best_for:"Hydration", image:"https://m.media-amazon.com/images/I/71g7z7y5sKL.jpg" }
  ],
  acne_patch: [
    { title:"Mighty Patch", asin:"B07QYQJZQJ", price:"12", rating:"4.5", reviews:"120000", best_for:"Pimples", image:"https://m.media-amazon.com/images/I/hero.jpg" }
  ],
  ring_light: [
    { title:"UBeesize Ring Light", asin:"B07PZHGFLW", price:"38", rating:"4.6", reviews:"85000", best_for:"Content creation", image:"https://m.media-amazon.com/images/I/ring.jpg" }
  ]
};

function loadProducts(cat){
  try {
    return JSON.parse(fs.readFileSync(`products-${cat}.json`,"utf8"));
  } catch {
    return DUMMY[cat] || [];
  }
}

/* =======================
   CTR TRACKING LINK
======================= */
function trackLink(asin, slug){
  return `tracker.html?asin=${asin}&src=${slug}`;
}

/* =======================
   PRODUCT SCHEMA
======================= */
function productSchema(p){
  return `
<script type="application/ld+json">
{
 "@context":"https://schema.org/",
 "@type":"Product",
 "name":"${p.title}",
 "image":"${p.image}",
 "description":"Top rated Amazon product in its category",
 "sku":"${p.asin}",
 "offers":{
   "@type":"Offer",
   "price":"${p.price}",
   "priceCurrency":"USD",
   "url":"${amazonUrl(p.asin)}"
 }
}
</script>`;
}

/* =======================
   PRODUCT CARD (UPGRADED)
======================= */
function productCard(p,i,cat){
  const link = trackLink(p.asin, cat);

  return `
<div style="background:#fff;padding:18px;margin:16px 0;border-radius:14px;box-shadow:0 5px 20px rgba(0,0,0,0.08);">

  <a href="${link}" target="_blank">
    <img src="${p.image}" style="width:200px;height:200px;object-fit:cover;border-radius:10px;" />
  </a>

  <h3>#${i} ${escapeHTML(p.title)}</h3>

  <p>Best for: ${p.best_for}</p>

  <p>⭐ ${p.rating} (${p.reviews}) • $${p.price}</p>

  <a href="${link}" target="_blank"
     style="display:inline-block;padding:10px 16px;background:#ff4d4d;color:#fff;border-radius:8px;text-decoration:none;">
     Buy on Amazon
  </a>

</div>`;
}

/* =======================
   AUTHORITY PAGE (HUB)
======================= */
function buildAuthorityPage(catSlug, cat){
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Best ${cat.name} Hub 2026</title>

<meta name="google-site-verification" content="${GOOGLE_VERIFICATION}">
<meta name="msvalidate.01" content="${BING_VERIFICATION}">

</head>
<body style="font-family:system-ui;max-width:900px;margin:auto;">

<h1>${cat.name} Authority Hub</h1>

<p>Best guides, reviews, and comparisons</p>

<ul>
  <li><a href="best-${catSlug}-en.html">Best Picks</a></li>
  <li><a href="review-${catSlug}-en.html">Reviews</a></li>
  <li><a href="guide-${catSlug}-en.html">Buying Guide</a></li>
  <li><a href="vs-${catSlug}-en.html">Comparison</a></li>
</ul>

</body>
</html>`;
}

/* =======================
   PAGE BUILDER
======================= */
function buildPage(type, catSlug, cat, products){
  const links = Object.keys(CATEGORIES)
    .map(k=>`<a href="best-${k}-en.html">${CATEGORIES[k].name}</a>`)
    .join(" | ");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${type} ${cat.name}</title>
${productSchema(products[0] || {})}
</head>

<body style="font-family:system-ui;max-width:1000px;margin:auto;">

<h1>${type.toUpperCase()} ${cat.name}</h1>

<nav>${links}</nav>

${products.map((p,i)=>productCard(p,i+1,catSlug)).join("")}

</body>
</html>`;
}

/* =======================
   GENERATION ENGINE
======================= */
let pageCount = 0;

Object.entries(CATEGORIES).forEach(([slug,cat])=>{

  const products = loadProducts(slug);

  /* AUTHORITY PAGE */
  fs.writeFileSync(`${slug}-hub.html`, buildAuthorityPage(slug,cat));
  pageCount++;

  LANGUAGES.forEach(lang=>{
    PAGE_TYPES.forEach(type=>{
      const file = `${type}-${slug}-${lang}.html`;
      fs.writeFileSync(file, buildPage(type,slug,cat,products.slice(0,5)));
      pageCount++;
    });
  });

});

/* =======================
   INDEX
======================= */
fs.writeFileSync("index.html", `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="google-site-verification" content="${GOOGLE_VERIFICATION}">
<meta name="msvalidate.01" content="${BING_VERIFICATION}">
<title>Best Products 2026</title>
</head>

<body style="font-family:system-ui;padding:40px;">

<h1>🔥 Best Products Hub</h1>
<p>${pageCount} pages generated</p>

${Object.entries(CATEGORIES).map(([k,v])=>
`<div><a href="${k}-hub.html">${v.name} Hub</a></div>`
).join("")}

</body>
</html>
`);

/* =======================
   SITEMAP BOOSTED
======================= */
const urls = fs.readdirSync(".")
.filter(f=>f.endsWith(".html"))
.map(f=>{
  let priority = f.includes("hub") ? "1.0" : "0.7";
  return `
<url>
<loc>${SITE_URL}/${f}</loc>
<priority>${priority}</priority>
</url>`;
}).join("");

fs.writeFileSync("sitemap.xml", `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);

console.log("DONE:",pageCount,"pages");
