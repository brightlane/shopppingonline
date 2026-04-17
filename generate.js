const fs = require("fs");
const { buildHead } = require("./head.lock.js");

const AFFILIATE_TAG = "brightlane201-20";

const LANGUAGES = ["en", "es", "de"];

const PAGE_TYPES = [
  "best",
  "top",
  "ultimate",
  "guide",
  "review",
  "vs",
  "buying",
  "ranking",
  "picks"
];

const CATEGORIES = {
  vacuum: { name: "Vacuum Cleaners" },
  coffee: { name: "Coffee Makers" },
  stanley: { name: "Stanley Quencher Tumblers" },
  acne_patch: { name: "Acne Patches" },
  ring_light: { name: "Ring Lights for Phone" }
};

// ===============================
// 🔗 AMAZON LINK BUILDER (FIXED)
// ===============================
function amazonUrl(asin) {
  if (!asin) return "#";
  const clean = asin.trim().toUpperCase();
  if (!/^B[A-Z0-9]{9,10}$/.test(clean)) return "#";
  return `https://www.amazon.com/dp/${clean}?tag=${AFFILIATE_TAG}`;
}

// ===============================
function escapeHTML(str = "") {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ===============================
function loadProducts(cat) {
  try {
    return JSON.parse(fs.readFileSync(`products-${cat}.json`, "utf8"));
  } catch {
    return [];
  }
}

// ===============================
// REMOVE DUPLICATES (IMPORTANT FIX)
// ===============================
function dedupe(products) {
  const seen = new Set();
  return products.filter(p => {
    if (!p.asin || seen.has(p.asin)) return false;
    seen.add(p.asin);
    return true;
  });
}

// ===============================
function productCard(cat, p, i) {
  const link = amazonUrl(p.asin);

  return `
  <div style="background:#fff;padding:20px;margin:20px 0;border-radius:14px;
  box-shadow:0 10px 25px rgba(0,0,0,0.08);">

    <h3>#${i} ${escapeHTML(p.title)}</h3>

    <img src="${escapeHTML(p.image || "")}"
      style="width:180px;height:180px;object-fit:cover;border-radius:10px;" />

    <p style="color:#444">${p.best_for || "Top rated product"}</p>

    <p><b>$${p.price || "—"}</b> ⭐ ${p.rating || "4.5"}</p>

    <a href="${link}" target="_blank"
      style="display:inline-block;padding:10px 16px;background:#ff4d2d;color:#fff;
      border-radius:8px;text-decoration:none;">
      Buy on Amazon
    </a>

  </div>`;
}

// ===============================
function buildPage(type, cat, products, lang = "en") {
  const title = `${type.toUpperCase()} ${cat.name} 2026`;

  const description = `Best ${cat.name} products ranked and reviewed for 2026.`;

  const safeProducts = dedupe(products).slice(0, 6);

  return `
<!DOCTYPE html>
<html lang="${lang}">

${buildHead(title, description)}

<body style="font-family:system-ui;background:#f6f7fb;padding:30px;max-width:1100px;margin:auto;">

<h1>${title}</h1>

${safeProducts.map((p, i) => productCard(cat, p, i + 1)).join("")}

</body>
</html>`;
}

// ===============================
// GENERATION LOOP
// ===============================
let count = 0;

Object.entries(CATEGORIES).forEach(([slug, cat]) => {
  let products = loadProducts(slug);

  if (!products.length) return;

  const base = slugify(cat.name);

  LANGUAGES.forEach(lang => {
    PAGE_TYPES.forEach(type => {
      const shuffled = [...products]
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);

      const file = `${type}-${base}-${lang}.html`;

      fs.writeFileSync(file, buildPage(type, cat, shuffled, lang));

      count++;
      console.log("Generated:", file);
    });
  });
});

// ===============================
// INDEX PAGE (SAFE + CLEAN)
// ===============================
fs.writeFileSync("index.html", `
<!DOCTYPE html>
<html>
<head>
<title>Best Products 2026</title>

<meta name="google-site-verification" content="eWVDN3vbam9nnaZQu7wAQKyfmJJdM7zjI80l4DGeUrQ">
<meta name="msvalidate.01" content="574044E39556B8B8DAAF1D1F233C87B0">

</head>

<body style="font-family:system-ui;padding:40px;background:#f7fafc;">

<h1>Best Products Hub</h1>
<p>${count} pages generated</p>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px">

${Object.entries(CATEGORIES).map(([slug, cat]) => `
<div style="background:#fff;padding:20px;border-radius:12px;">
  <h3>${cat.name}</h3>
  <a href="best-${slugify(cat.name)}-en.html">View</a>
</div>
`).join("")}

</div>

</body>
</html>
`);

console.log("DONE:", count);
