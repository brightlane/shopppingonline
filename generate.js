const fs = require("fs");

const AFFILIATE_TAG = "brightlane201-20";

const LANGUAGES = ["en", "es", "de"];

const PAGE_TYPES = [
  "best", "top", "ultimate", "vs", "guide", "review",
  "buying", "compared", "showdown", "battle", "ranking", "picks"
];

const CATEGORIES = {
  vacuum: { name: "Vacuum Cleaners" },
  coffee: { name: "Coffee Makers" },
  stanley: { name: "Stanley Quencher Tumblers" },
  acne_patch: { name: "Acne Patches" },
  ring_light: { name: "Ring Lights for Phone" }
};

// -----------------------------
// SAFE AMAZON LINK BUILDER
// -----------------------------
function amazonUrl(asin) {
  if (!asin || typeof asin !== "string") return "#";
  const clean = asin.trim().toUpperCase();

  // FIX: prevent broken 404 links
  if (!/^B[A-Z0-9]{9,10}$/.test(clean)) return "#";

  return `https://www.amazon.com/dp/${clean}?tag=${AFFILIATE_TAG}`;
}

// -----------------------------
function escapeHTML(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// -----------------------------
// LOAD PRODUCTS (SAFE)
// -----------------------------
function loadProducts(cat) {
  try {
    return JSON.parse(fs.readFileSync(`products-${cat}.json`, "utf8"));
  } catch {
    console.log(`⚠️ Missing products-${cat}.json`);
    return [];
  }
}

// -----------------------------
// DEDUPE BY ASIN (IMPORTANT FIX)
// -----------------------------
function dedupe(products) {
  const seen = new Set();
  return products.filter(p => {
    if (!p.asin || seen.has(p.asin)) return false;
    seen.add(p.asin);
    return true;
  });
}

// -----------------------------
// SMART DESCRIPTION (NO AI DEPENDENCY)
// -----------------------------
function smartDesc(cat, p) {
  const map = {
    vacuum: "High-performance vacuum designed for deep cleaning, pet hair, and modern homes.",
    coffee: "Premium coffee system built for consistent brewing and rich flavor extraction.",
    stanley: "Durable insulated tumbler engineered for long-lasting temperature control.",
    acne_patch: "Fast-acting acne treatment patch designed to reduce blemishes overnight.",
    ring_light: "Professional lighting tool for creators, streaming, and photography."
  };
  return map[cat] || "Top-rated product selected for performance, value, and reliability.";
}

// -----------------------------
// PRODUCT CARD (FIXED + CLEAN UI)
// -----------------------------
function productCard(cat, p, i) {
  const link = amazonUrl(p.asin);

  const faq = [
    `Is ${p.title} worth it? Yes, it is one of the most reliable options in its category.`,
    `What is it best for? ${p.best_for || "general everyday use"}.`
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    image: p.image,
    description: smartDesc(cat, p),
    offers: {
      "@type": "Offer",
      price: p.price || "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: link
    }
  };

  return `
  <div style="background:#fff;padding:20px;margin:20px 0;border-radius:14px;
    box-shadow:0 10px 30px rgba(0,0,0,0.08);display:flex;gap:20px;">

    <a href="${link}" target="_blank">
      <img src="${escapeHTML(p.image || "")}"
        style="width:180px;height:180px;object-fit:cover;border-radius:12px;" />
    </a>

    <div style="flex:1">

      <h3>#${i} ${escapeHTML(p.title)}</h3>

      <p style="color:#555">${smartDesc(cat, p)}</p>

      <p><b>$${p.price || "—"}</b> • ⭐ ${p.rating || "4.5"} (${p.reviews || "—"})</p>

      <a href="${link}" target="_blank"
        style="display:inline-block;padding:10px 16px;background:#ff5a3c;color:#fff;
        border-radius:8px;text-decoration:none;font-weight:bold;">
        View on Amazon
      </a>

      <script type="application/ld+json">
        ${JSON.stringify(schema)}
      </script>

      <div style="margin-top:10px;font-size:13px;color:#444">
        <b>FAQ:</b>
        <p>${faq[0]}</p>
        <p>${faq[1]}</p>
      </div>

    </div>
  </div>`;
}

// -----------------------------
function buildPage(type, catKey, cat, products, lang) {
  const title = `${type.toUpperCase()} ${cat.name} 2026`;

  const internalLinks = PAGE_TYPES.map(t =>
    `<a href="${t}-${slugify(cat.name)}-${lang}.html">${t}</a>`
  ).join(" | ");

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<meta name="description" content="Best ${cat.name} products ranked 2026" />
</head>

<body style="font-family:system-ui;background:#f6f7fb;padding:30px;max-width:1100px;margin:auto;">

<h1>${title}</h1>

<p style="color:#555">${internalLinks}</p>

${products.map((p, i) => productCard(catKey, p, i + 1)).join("")}

<footer style="margin-top:50px;text-align:center;color:#666">
  <p>Amazon Affiliate Disclosure: We earn from qualifying purchases.</p>
  <a href="index.html">Back Home</a>
</footer>

</body>
</html>`;
}

// -----------------------------
// GENERATE SITE
// -----------------------------
let count = 0;

Object.entries(CATEGORIES).forEach(([slug, cat]) => {
  let products = dedupe(loadProducts(slug));

  if (!products.length) return;

  const base = slugify(cat.name);

  LANGUAGES.forEach(lang => {
    PAGE_TYPES.forEach(type => {

      const picked = [...products]
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);

      const file = `${type}-${base}-${lang}.html`;

      fs.writeFileSync(
        file,
        buildPage(type, slug, cat, picked, lang)
      );

      count++;
      console.log("Created:", file);
    });
  });
});

// -----------------------------
// INDEX (IMPROVED)
// -----------------------------
fs.writeFileSync("index.html", `
<!DOCTYPE html>
<html>
<head>
<title>Best Products 2026</title>
</head>

<body style="font-family:system-ui;padding:40px;background:#f7fafc;">

<h1>Best Products Hub</h1>
<p>${count} pages generated</p>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px">

${Object.entries(CATEGORIES).map(([slug, cat]) => `
<div style="background:#fff;padding:20px;border-radius:12px;">
  <h3>${cat.name}</h3>
  <a href="best-${slugify(cat.name)}-en.html">View English</a>
</div>
`).join("")}

</div>

</body>
</html>
`);

console.log("DONE:", count, "pages");
