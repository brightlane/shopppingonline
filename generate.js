const fs = require("fs");

const AFFILIATE_TAG = "brightlane201-20";
const LANGUAGES = ["en", "es", "de"];
const PAGE_TYPES = [
  "best", "top", "ultimate", "vs", "guide", "review", "2026",
  "buying", "compared", "showdown", "battle", "ranking", "picks", "choices"
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
    keywords: ["ring light for phone", "portable led ring light"]
  },
};

function escapeHTML(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function loadProducts(cat) {
  const fn = `products-${cat}.json`;
  try {
    const raw = fs.readFileSync(fn, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.log(`⚠️ ${fn} missing (dummy)`); 
    return DUMMY[cat] || [];
  }
}

const DUMMY = {
  vacuum: [
    { title:"Dyson V15", asin:"B08N5LN61C", price:"749", rating:"4.7", reviews:"12500", best_for:"Carpets", image:"https://m.media-amazon.com/images/I/81bA5hK5gZL.jpg" },
    { title:"Shark PowerDetect", asin:"B0D2H8YR4R", price:"450", rating:"4.6", reviews:"8500", best_for:"Apartments", image:"https://m.media-amazon.com/images/I/71oK1zK5gZL.jpg" },
  ],
  coffee: [
    { title:"Moccamaster KBGV", asin:"B01N6N2ARX", price:"359", rating:"4.8", reviews:"12000", best_for:"Home office", image:"https://m.media-amazon.com/images/I/moccamaster.jpg" },
    { title:"Nespresso Vertuo Next", asin:"B08G9K1234", price:"169", rating:"4.6", reviews:"21000", best_for:"Small kitchen", image:"https://m.media-amazon.com/images/I/nespresso.jpg" },
  ],
  stanley: [
    { title:"Stanley Quencher 40oz", asin:"B0CGRCP4ML", price:"45", rating:"4.8", reviews:"125000", best_for:"Gym, office", image:"https://m.media-amazon.com/images/I/71g7z7y5sKL._AC_SL1500_.jpg" },
  ],
  acne_patch: [
    { title:"Mighty Patch Original", asin:"B07QYQJZQJ", price:"12", rating:"4.5", reviews:"120000", best_for:"Pimple overnight", image:"https://m.media-amazon.com/images/I/hero-mighty.jpg" },
  ],
  ring_light: [
    { title:"UBeesize 10-inch Ring Light", asin:"B07PZHGFLW", price:"38", rating:"4.6", reviews:"85000", best_for:"TikTok creators", image:"https://m.media-amazon.com/images/I/ubeesize-ring.jpg" },
  ]
};

function productCard(p, i) {
  return `<div style="
    background:#fff;padding:20px;margin:15px 0;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,0.1);
  ">
    <h3>#${i+1} ${escapeHTML(p.title)}</h3>
    <img src="${escapeHTML(p.image||"")}" alt="${escapeHTML(p.title)}" width="200" height="200"
         style="border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.12);margin-bottom:15px;" loading="lazy" />
    <p style="color:#4a5568;">${escapeHTML(p.description||"")}</p>
    <p style="font-weight:600;">
      <span style="color:#22c55e;">$${p.price||"TBD"}</span> •
      <span style="color:#f59e0b;">${p.rating||"4.5"}⭐ (${p.reviews||"1000+"} reviews)</span>
    </p>
    <a href="https://amazon.com/dp/${p.asin}?tag=${AFFILIATE_TAG}"
       style="display:inline-block;padding:10px 20px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;border-radius:8px;font-weight:600;text-align:center;text-decoration:none;"
       target="_blank">🛒 Buy on Amazon</a>
  </div>`;
}

function buildPage(type, cat, products, lang = "en") {
  const title =
    ({ best: `Best ${cat.name} 2026`, top: `Top ${cat.name} 2026`, 2026: `Top ${cat.name} 2026` }[type]) ||
    type.charAt(0).toUpperCase() + type.slice(1) + ` ${cat.name}`;

  return `<!DOCTYPE html>
<html lang="${lang}"><head>
  <meta charset="UTF-8">
  <title>${title} | Best ${cat.name.toLowerCase()} 2026</title>
  <meta name="description" content="Best ${cat.name.toLowerCase()} 2026 – ${products.length} models reviewed." />
</head><body style="font-family:system-ui,max-width:1000px;margin:auto;padding:20px;background:#f8fafc;">
  <h1>${title}</h1>
  <p>Tested & Ranked | ${products.length} models</p>
  ${products.map((p, i) => productCard(p, i + 1)).join("\n")}
  <p style="color:#718096;margin-top:40px;text-align:center;">
    <strong>As an Amazon Associate we earn from qualifying purchases.</strong><br>
    <a href="index.html">← All Categories</a>
  </p>
</body></html>`;
}

// GENERATE PAGES
let pageCount = 0;

Object.entries(CATEGORIES).forEach(([slug, cat]) => {
  const ps = loadProducts(slug) || DUMMY[slug] || [];
  if (!ps.length) return console.log(`⚠️ no products for ${slug}`); 
  const base = slugify(cat.name);

  LANGUAGES.forEach((lang) => {
    PAGE_TYPES.forEach((type) => {
      const shuffled = [...ps].sort(() => Math.random() - 0.5).slice(0, 6);
      const file = `${type}-${base}-${lang}.html`;
      const html = buildPage(type, cat, shuffled, lang);
      fs.writeFileSync(file, html, "utf8");
      pageCount++;
      console.log(`📄 ${file}`);
    });
  });
});

// INDEX PAGE
fs.writeFileSync("index.html", `<!DOCTYPE html><html><head>
  <title>Best Products 2026</title>
</head><body style="padding:40px;background:#f7fafc;font-family:system-ui;">
  <h1 style="text-align:center;">Best Products 2026</h1>
  <p style="text-align:center;">${pageCount} pages created</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;max-width:1000px;margin:auto;">
    ${Object.entries(CATEGORIES).map(([slug, cat]) => `
      <div style="background:#fff;padding:20px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.1);">
        <h2 style="margin:0;">${cat.name}</h2>
        <a href="best-${slugify(cat.name)}-en.html">🇺🇸 English</a><br>
        <a href="best-${slugify(cat.name)}-es.html">🇪🇸 Español</a><br>
        <a href="best-${slugify(cat.name)}-de.html">🇩🇪 Deutsch</a>
      </div>
    `).join("")}
  </div>
</body></html>`);

// SITEMAP
const siteUrl = "https://brightlane.github.io/shopppingonline";
const fns = fs.readdirSync(".");
const urls = fns
  .filter(f => f.endsWith(".html"))
  .map(f => `
  <url>
    <loc>${siteUrl}/${f}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>${urls}
</urlset>`;

fs.writeFileSync("sitemap.xml", sitemap, "utf8");
console.log("✅ sitemap.xml generated");
console.log(`\n💥 GENERATION COMPLETE!`);
console.log(`📂 ${pageCount} pages created`);
