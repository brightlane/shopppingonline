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
  }
};

function escapeHTML(str = "") {
  return String(str)
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

/* -----------------------------
   AMAZON LINK (SAFE + CLEAN)
------------------------------ */
function amazonUrl(asin) {
  if (!asin) {
    return `https://www.amazon.com/?tag=${AFFILIATE_TAG}`;
  }
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

/* -----------------------------
   LOAD PRODUCTS
------------------------------ */
function loadProducts(cat) {
  const fn = `products-${cat}.json`;
  try {
    return JSON.parse(fs.readFileSync(fn, "utf8"));
  } catch (err) {
    console.log(`⚠️ Missing ${fn}, using fallback`);
    return DUMMY[cat] || [];
  }
}

/* -----------------------------
   DUMMY DATA (FALLBACK SAFE)
------------------------------ */
const DUMMY = {
  vacuum: [
    { title: "Dyson V15", asin: "B08N5LN61C", price: "749", rating: "4.7", reviews: "12500", best_for: "Carpets", image: "https://m.media-amazon.com/images/I/81bA5hK5gZL.jpg" },
    { title: "Shark PowerDetect", asin: "B0D2H8YR4R", price: "450", rating: "4.6", reviews: "8500", best_for: "Apartments", image: "https://m.media-amazon.com/images/I/71oK1zK5gZL.jpg" }
  ],
  coffee: [
    { title: "Moccamaster KBGV", asin: "B01N6N2ARX", price: "359", rating: "4.8", reviews: "12000", best_for: "Home office", image: "https://m.media-amazon.com/images/I/moccamaster.jpg" }
  ],
  stanley: [
    { title: "Stanley Quencher 40oz", asin: "B0CGRCP4ML", price: "45", rating: "4.8", reviews: "125000", best_for: "Gym, office", image: "https://m.media-amazon.com/images/I/71g7z7y5sKL._AC_SL1500_.jpg" }
  ],
  acne_patch: [
    { title: "Mighty Patch Original", asin: "B07QYQJZQJ", price: "12", rating: "4.5", reviews: "120000", best_for: "Pimple overnight", image: "https://m.media-amazon.com/images/I/hero-mighty.jpg" }
  ],
  ring_light: [
    { title: "UBeesize Ring Light", asin: "B07PZHGFLW", price: "38", rating: "4.6", reviews: "85000", best_for: "TikTok creators", image: "https://m.media-amazon.com/images/I/ubeesize-ring.jpg" }
  ]
};

/* -----------------------------
   PRODUCT CARD (UPGRADED UX)
------------------------------ */
function productCard(p, i, category) {
  const link = amazonUrl(p.asin);

  const insights = {
    vacuum: "High-performance suction system designed for deep carpet and pet hair cleaning.",
    coffee: "Engineered for consistent brewing quality and smooth coffee extraction.",
    stanley: "Temperature-retention design built for hydration throughout the entire day.",
    acne_patch: "Fast-acting hydrocolloid technology helps reduce blemishes overnight.",
    ring_light: "Improves lighting quality for videos, photos, and live streaming."
  };

  const useCase = p.best_for
    ? `Best for: ${p.best_for}`
    : "Great all-around choice for everyday use";

  const pros = [
    "Top-rated customer favorite",
    "Reliable long-term performance",
    "Strong value for the price"
  ];

  return `
  <div style="
    background:#fff;
    padding:20px;
    margin:18px 0;
    border-radius:14px;
    box-shadow:0 6px 20px rgba(0,0,0,0.08);
    display:flex;
    gap:20px;
    flex-wrap:wrap;
  ">

    <!-- IMAGE -->
    <a href="${link}" target="_blank" style="flex:0 0 200px;">
      <img src="${escapeHTML(p.image || "")}"
        alt="${escapeHTML(p.title)}"
        style="
          width:200px;
          height:200px;
          object-fit:cover;
          border-radius:12px;
          box-shadow:0 4px 12px rgba(0,0,0,0.15);
          cursor:pointer;
        "
        loading="lazy"
      />
    </a>

    <!-- CONTENT -->
    <div style="flex:1; min-width:260px;">

      <h3 style="margin:0 0 6px;">#${i} ${escapeHTML(p.title)}</h3>

      <p style="margin:0 0 8px;color:#4a5568;font-size:14px;">
        ${useCase}
      </p>

      <p style="font-size:13px;color:#555;margin-bottom:10px;">
        ${insights[category] || "A high-quality product selected for performance and reliability."}
      </p>

      <ul style="margin:10px 0;padding-left:18px;font-size:13px;color:#374151;">
        ${pros.map(x => `<li>${x}</li>`).join("")}
      </ul>

      <p style="font-weight:600;margin:10px 0;">
        <span style="color:#22c55e;">$${p.price || "—"}</span> •
        <span style="color:#f59e0b;">${p.rating || "4.5"}⭐ (${p.reviews || "1000+"})</span>
      </p>

      <a href="${link}" target="_blank"
        style="
          display:inline-block;
          padding:12px 18px;
          background:linear-gradient(135deg,#ff7a18,#ff3d00);
          color:#fff;
          border-radius:10px;
          font-weight:700;
          text-decoration:none;
        ">
        🛒 View on Amazon
      </a>

    </div>
  </div>`;
}

/* -----------------------------
   PAGE BUILDER
------------------------------ */
function buildPage(type, cat, products, lang = "en") {
  const title =
    ({ best: `Best ${cat.name} 2026`, top: `Top ${cat.name} 2026`, 2026: `Top ${cat.name} 2026` }[type]) ||
    `${type.charAt(0).toUpperCase() + type.slice(1)} ${cat.name} 2026`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<meta name="description" content="Best ${cat.name} 2026 – expert picks and comparisons." />
</head>
<body style="font-family:system-ui;max-width:1000px;margin:auto;padding:20px;background:#f8fafc;">

<h1>${title}</h1>
<p>Expert picks • ${products.length} products analyzed</p>

${products.map((p, i) => productCard(p, i + 1, slugify(cat.name))).join("")}

<p style="margin-top:40px;text-align:center;color:#718096;">
<strong>As an Amazon Associate I earn from qualifying purchases.</strong><br>
<a href="index.html">← Back to Categories</a>
</p>

</body>
</html>`;
}

/* -----------------------------
   GENERATION ENGINE
------------------------------ */
let pageCount = 0;

Object.entries(CATEGORIES).forEach(([slug, cat]) => {
  const ps = loadProducts(slug);

  LANGUAGES.forEach(lang => {
    PAGE_TYPES.forEach(type => {

      const products = [...ps]
        .map(p => ({ ...p, category: slug }))
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);

      const file = `${type}-${slugify(cat.name)}-${lang}.html`;

      fs.writeFileSync(file, buildPage(type, cat, products, lang));
      pageCount++;

      console.log("📄", file);
    });
  });
});

/* -----------------------------
   INDEX PAGE
------------------------------ */
fs.writeFileSync("index.html", `
<!DOCTYPE html>
<html>
<head>
<title>Best Products 2026</title>
</head>
<body style="padding:40px;font-family:system-ui;background:#f7fafc;">

<h1 style="text-align:center;">Best Products 2026</h1>
<p style="text-align:center;">${pageCount} pages generated</p>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;max-width:1000px;margin:auto;">

${Object.entries(CATEGORIES).map(([slug, cat]) => `
<div style="background:#fff;padding:20px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.1);">
  <h2>${cat.name}</h2>
  <a href="best-${slugify(cat.name)}-en.html">🇺🇸 English</a>
</div>
`).join("")}

</div>
</body>
</html>
`);

/* -----------------------------
   SITEMAP
------------------------------ */
const siteUrl = "https://brightlane.github.io/shopppingonline";

const urls = fs.readdirSync(".")
  .filter(f => f.endsWith(".html"))
  .map(f => `
  <url>
    <loc>${siteUrl}/${f}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("");

fs.writeFileSync("sitemap.xml", `<?xml version="1.0"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>${siteUrl}</loc>
<priority>1.0</priority>
</url>
${urls}
</urlset>`);

console.log("✅ DONE: Full system generated");
console.log(`📊 Pages: ${pageCount}`);
