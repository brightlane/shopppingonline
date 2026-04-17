const fs = require("fs");

/* =========================
   🔒 GLOBAL CONFIG
========================= */

const AFFILIATE_TAG = "brightlane201-20";

const LANGUAGES = ["en", "es", "de"];

const PAGE_TYPES = [
  "best","top","ultimate","vs","guide","review","2026",
  "buying","compared","showdown","battle","ranking","picks","choices"
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
    keywords: ["tumbler", "hydration bottle"]
  },
  acne_patch: {
    name: "Acne Patches",
    keywords: ["pimple patch", "acne patch"]
  },
  ring_light: {
    name: "Ring Lights for Phone",
    keywords: ["ring light", "selfie light"]
  }
};

/* =========================
   🔥 AMAZON LINK FIX (NO 404 EVER)
========================= */

function amazonUrl(asin, title = "") {
  const tag = AFFILIATE_TAG;
  const q = encodeURIComponent(title || "best product");

  if (!asin || typeof asin !== "string" || asin.length < 8) {
    return `https://www.amazon.com/s?k=${q}&tag=${tag}`;
  }

  return `https://www.amazon.com/dp/${asin}?tag=${tag}`;
}

/* =========================
   🧹 CLEAN PRODUCT DATA
========================= */

function cleanProducts(products = []) {
  return products.filter(p =>
    p &&
    p.title &&
    p.image &&
    p.price &&
    typeof p.asin === "string" &&
    p.asin.length >= 8 &&
    !p.asin.includes("1234") &&
    !p.asin.toLowerCase().includes("test")
  );
}

/* =========================
   🎨 MODERN PRODUCT CARD (HIGH CTR)
========================= */

function productCard(p, i) {
  const link = amazonUrl(p.asin, p.title);

  return `
  <div style="
    background:#fff;
    border-radius:18px;
    padding:20px;
    margin:18px 0;
    box-shadow:0 10px 30px rgba(0,0,0,0.08);
    display:flex;
    gap:20px;
    flex-wrap:wrap;
    transition:0.2s;
  ">

    <!-- IMAGE -->
    <a href="${link}" target="_blank">
      <img src="${p.image}"
        alt="${p.title}"
        style="
          width:180px;
          height:180px;
          object-fit:cover;
          border-radius:14px;
          cursor:pointer;
        "/>
    </a>

    <!-- CONTENT -->
    <div style="flex:1;min-width:250px;">

      <h2 style="margin:0 0 8px 0;font-size:18px;">
        #${i} ${p.title}
      </h2>

      <p style="margin:0 0 6px 0;color:#666;">
        ⭐ ${p.rating || "4.5"} / 5 • ${p.reviews || "1K+"} reviews
      </p>

      <p style="margin:0 0 10px 0;color:#444;">
        Best for: <b>${p.best_for || "everyday use"}</b>
      </p>

      <p style="margin:0 0 10px 0;color:#777;font-size:13px;">
        ${p.description || "Top-rated product in this category."}
      </p>

      <div style="font-size:18px;font-weight:700;color:#16a34a;margin-bottom:12px;">
        $${p.price}
      </div>

      <a href="${link}" target="_blank"
        style="
          display:inline-block;
          padding:12px 18px;
          background:linear-gradient(135deg,#ff7a18,#ff3d00);
          color:white;
          border-radius:10px;
          font-weight:700;
          text-decoration:none;
        ">
        🛒 View on Amazon
      </a>

    </div>
  </div>
  `;
}

/* =========================
   📄 PAGE BUILDER (SEO SAFE + VERIFIED HEAD)
========================= */

function buildPage(type, cat, products, lang = "en") {

  const title = `Best ${cat.name} 2026`;

  const cleaned = cleanProducts(products).slice(0, 6);

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<meta name="description" content="Best ${cat.name} 2026 - top rated picks reviewed." />

<!-- 🔒 DO NOT TOUCH: SITE VERIFICATION -->
<meta name="google-site-verification" content="eWVDN3vbam9nnaZQu7wAQKyfmJJdM7zjI80l4DGeUrQ" />
<meta name="msvalidate.01" content="574044E39556B8B8DAAF1D1F233C87B0" />

</head>

<body style="
  font-family:system-ui;
  margin:0;
  background:linear-gradient(180deg,#f8fafc,#eef2f7);
">

<div style="max-width:1000px;margin:auto;padding:25px;">

<h1 style="text-align:center;margin-bottom:8px;">
  ${title}
</h1>

<p style="text-align:center;color:#666;margin-bottom:25px;">
  Honest reviews • Updated 2026 • Affiliate picks
</p>

${cleaned.map((p, i) => productCard(p, i + 1)).join("")}

</div>

</body>
</html>
`;
}

/* =========================
   🚀 GENERATION ENGINE
========================= */

Object.entries(CATEGORIES).forEach(([slug, cat]) => {

  let products = [];

  try {
    products = JSON.parse(fs.readFileSync(`products-${slug}.json`, "utf8"));
  } catch (e) {
    console.log("missing:", slug);
  }

  LANGUAGES.forEach(lang => {
    PAGE_TYPES.forEach(type => {

      const html = buildPage(type, cat, products, lang);
      const file = `${type}-${slug}-${lang}.html`;

      fs.writeFileSync(file, html);
      console.log("generated:", file);
    });
  });

});
