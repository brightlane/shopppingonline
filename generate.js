const fs = require("fs");

// ——————————————————— 1. SETUP & LOGGING ———————————————————
console.log("🚀 NUCLEAR GENERATOR: 3K+ AFFILIATE PAGES");
console.log("📂 Current directory:", __dirname);

// ——————————————————— 2. CONFIG (Affiliate ID) ———————————————————
const AFFILIATE_TAG = "brightlane201-20"; // ← YOUR AMAZON ID

const LANGUAGES = ["en", "es", "de"];
const PAGE_TYPES = [
  "best",
  "top",
  "ultimate",
  "vs",
  "guide",
  "review",
  "2026",
  "buying",
  "compared",
  "showdown",
  "battle",
  "ranking",
  "picks",
  "choices",
];

// ——————————————————— 3. CATEGORIES ———————————————————
const CATEGORIES = {
  vacuum: {
    name: "Vacuum Cleaners",
    keywords: ["cordless vacuum", "robot vacuum", "upright vacuum", "stick vacuum"],
  },
  coffee: {
    name: "Coffee Makers",
    keywords: ["espresso", "drip coffee", "single serve", "pod coffee"],
  },
  stanley: {
    name: "Stanley Quencher Tumblers",
    keywords: ["stanley cup", "tumbler", "viral stanley", "insulated tumbler"],
  },
  acne_patch: {
    name: "Acne Patches",
    keywords: [
      "acne patch",
      "pimple patch",
      "spot patch",
      "hydrocolloid patch",
      "mightypatch style",
      "acne solution patches",
    ],
  },
  ring_light: {
    name: "Ring Lights for Phone",
    keywords: [
      "ring light for phone",
      "portable led ring light",
      "tiktok ring light",
      "selfie ring light",
      "usb ring light with tripod",
    ],
  },
};

// ——————————————————— 4. HELPERS ———————————————————
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
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ——————————————————— 5. LOADING PRODUCTS ———————————————————
function loadProducts(cat) {
  const filename = `products-${cat}.json`;
  try {
    const raw = fs.readFileSync(filename, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.log(`⚠️  Missing ${filename} - using dummy data for "${cat}"`);
    return DUMMY_PRODUCTS[cat] || [];
  }
}

const DUMMY_PRODUCTS = {
  vacuum: [
    {
      title: "Dyson V15 Detect",
      asin: "B08N5LN61C",
      image: "https://m.media-amazon.com/images/I/81bA5hK5gZL.jpg",
      price: "749",
      rating: "4.7",
      reviews: "12500",
      description: "Premium cordless vacuum, 230AW suction, laser dust view.",
      feature1: "60 min battery",
      feature2: "Auto-suction adjust",
      feature3: "Smart LCD display",
      best_for: "Carpet, hardwood, pet hair",
    },
    {
      title: "Shark PowerDetect Cordless",
      asin: "B0D2H8YR4R",
      image: "https://m.media-amazon.com/images/I/71oK1zK5gZL.jpg",
      price: "450",
      rating: "4.6",
      reviews: "8500",
      description: "Top cordless stick vacuum, 2026 review favorite.",
      best_for: "Everyday cleaning, apartments",
    },
    {
      title: "iRobot Roomba j9+",
      asin: "B0B1WP6Q4Z",
      image: "https://m.media-amazon.com/images/I/roomba-j9.jpg",
      price: "899",
      rating: "4.7",
      reviews: "4500",
      description: "Robot vacuum with self-emptying base.",
      best_for: "Hands-free cleaning",
    },
  ],

  coffee: [
    {
      title: "Technivorm Moccamaster KBGV",
      asin: "B01N6N2ARX",
      image: "https://m.media-amazon.com/images/I/moccamaster.jpg",
      price: "359",
      rating: "4.8",
      reviews: "12000",
      description: "Top drip coffee maker 2026, great for large batches.",
      best_for: "Home office, big family",
    },
    {
      title: "Nespresso Vertuo Next",
      asin: "B08G9K1234",
      image: "https://m.media-amazon.com/images/I/nespresso.jpg",
      price: "169",
      rating: "4.6",
      reviews: "21000",
      description: "Single-serve espresso and coffee maker.",
      best_for: "Coffee lover, small kitchen",
    },
    {
      title: "Breville Barista Express",
      asin: "B07C9R78QH",
      image: "https://m.media-amazon.com/images/I/breville.jpg",
      price: "699",
      rating: "4.7",
      reviews: "4200",
      description: "Semi-automatic espresso machine for home baristas.",
      best_for: "Latte art, cappuccino",
    },
  ],

  stanley: [
    {
      title: "Stanley Quencher H2.0 FlowState 40oz",
      asin: "B0CGRCP4ML",
      image: "https://m.media-amazon.com/images/I/71g7z7y5sKL._AC_SL1500_.jpg",
      price: "45",
      rating: "4.8",
      reviews: "125000",
      description: "Viral 40oz Stanley tumbler, 48+ hours ice, leakproof.",
      feature1: "Keeps drinks ice-cold 48+ hours",
      feature2: "Leakproof lid, no sweat on desk",
      feature3: "Fits in car cup holders",
      best_for: "All-day hydration, gym, office, travel",
    },
    {
      title: "Stanley Quencher 30oz",
      asin: "B0CGRCMJQD",
      image: "https://m.media-amazon.com/images/I/71oK1zK5gZL._AC_SL1500_.jpg",
      price: "38",
      rating: "4.9",
      reviews: "85000",
      description: "Perfect everyday size, massively popular colors.",
      best_for: "Daily carry, school, work",
    },
    {
      title: "Stanley AeroLight 20oz",
      asin: "B0D5H8YR4R",
      image: "https://m.media-amazon.com/images/I/aerolite.jpg",
      price: "35",
      rating: "4.7",
      reviews: "12000",
      description: "Lighter, smaller option for shorter trips.",
      best_for: "Short commute, kids, light hikes",
    },
    {
      title: "Stanley IceFLow 24oz",
      asin: "B09W2Q5Z3P",
      image: "https://m.media-amazon.com/images/I/iceflow.jpg",
      price: "29",
      rating: "4.6",
      reviews: "45000",
      description: "Sport-style lid with flip straw.",
      best_for: "Gym, sports, outdoor activities",
    },
    {
      title: "Stanley Adventure Stackable",
      asin: "B08XYZ7890",
      image: "https://m.media-amazon.com/images/I/stackable.jpg",
      price: "25",
      rating: "4.7",
      reviews: "28000",
      description: "Stackable cups for camping and group trips.",
      best_for: "Camping, family trips, picnics",
    },
  ],

  acne_patch: [
    {
      title: "Hero Cosmetics Mighty Patch Original",
      asin: "B07QYQJZQJ",
      image: "https://m.media-amazon.com/images/I/hero-mighty.jpg",
      price: "12",
      rating: "4.5",
      reviews: "120000",
      description: "Original hydrocolloid acne patch — overnight spot healing for face and body.",
      feature1: "Overnight spot reduction",
      feature2: "Waterproof & breathable",
      feature3: "Safe for sensitive skin",
      best_for: "Pimple overnight, travelers, on-the-go",
    },
    {
      title: "Aztec Secret Clay Patch (Extra Strength)",
      asin: "B0B2WQZ12H",
      image: "https://m.media-amazon.com/images/I/aztec-clay.jpg",
      price: "15",
      rating: "4.6",
      reviews: "85000",
      description: "Natural clay-based spot patch for deep extraction.",
      best_for: "Blackheads, clogged pores, nose patches",
    },
    {
      title: "Kiehl’s White Clay Spot Healing",
      asin: "B07C8K4XKH",
      image: "https://m.media-amazon.com/images/I/kiehls.jpg",
      price: "28",
      rating: "4.7",
      reviews: "42000",
      description: "Premium acne patch with anti-blemish benefits.",
      best_for: "Sensitive, acne-prone skin",
    },
    {
      title: "Generic Hydrocolloid Acne Patches 100‑pcs",
      asin: "B0D3H8YR5S",
      image: "https://m.media-amazon.com/images/I/sticker-patch.jpg",
      price: "8",
      rating: "4.6",
      reviews: "25000",
      description: "Budget multi-size patch set.",
      best_for: "Testing different sizes, travel size",
    },
    {
      title: "Korean Pimple Patch + Charcoal Variant",
      asin: "B0D4H9ZR6T",
      image: "https://m.media-amazon.com/images/I/korean-patch.jpg",
      price: "13",
      rating: "4.7",
      reviews: "38000",
      description: "Imported K‑Beauty style patch with charcoal.",
      best_for: "Blackhead and comedone control",
    },
  ],

  ring_light: [
    {
      title: "UBeesize 10-inch Ring Light for Phone",
      asin: "B07PZHGFLW",
      image: "https://m.media-amazon.com/images/I/ubeesize-ring.jpg",
      price: "38",
      rating: "4.6",
      reviews: "85000",
      description: "Portable USB ring light with tripod, 10\" size, for TikTok, Instagram, and YouTube.",
      feature1: "3 light modes (warm/cool/daylight)",
      feature2: "10 dimmable levels",
      feature3: "Phone holder + 60\" tripod",
      best_for: "TikTok creators, live streaming, Zoom, makeup",
    },
    {
      title: "Neewer 18-inch Ring Light Kit",
      asin: "B01MZEO3X5",
      image: "https://m.media-amazon.com/images/I/neewer-ring.jpg",
      price: "99",
      rating: "4.5",
      reviews: "42000",
      description: "18\" professional‑grade ring light with 3 color modes and 10 brightness levels.",
      best_for: "YouTube vlogging, studio‑style setup",
    },
    {
      title: "Lumecube Cordless Ring Light Pro",
      asin: "B07C8X2YZZ",
      image: "https://m.media-amazon.com/images/I/lumecube-ring.jpg",
      price: "279",
      rating: "4.7",
      reviews: "12000",
      description: "High‑end cordless ring light with remote control and color temperature adjustment.",
      best_for: "Content creators serious about quality lighting",
    },
    {
      title: "Westcott Mini Ring Light",
      asin: "B07QYQJZQJ",
      image: "https://m.media-amazon.com/images/I/westcott-mini.jpg",
      price: "16",
      rating: "4.5",
      reviews: "25000",
      description: "Clip‑on mini ring light for phones and laptops, very budget‑friendly.",
      best_for: "Students, beginners, low‑budget creators",
    },
    {
      title: "Joby Beamo Ring Light",
      asin: "B08XYZ7890",
      image: "https://m.media-amazon.com/images/I/beamo-ring.jpg",
      price: "71",
      rating: "4.6",
      reviews: "38000",
      description: "Magnetic ring light that attaches to magnetic phone mounts.",
      best_for: "On-the-go creators, travel vlogs",
    },
  ],
};

// ——————————————————— 6. PRODUCT CARD ———————————————————
function productCard(p, i) {
  const price = p.price || "TBD";
  const rating = p.rating || "4.5";
  const reviews = p.reviews || "1000+";

  return `
<div class="product-card" style="
  background: #ffffff;
  padding: 25px;
  margin: 20px 0;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border-left: 5px solid #4299e1;
">
  <h3 style="margin: 0 0 10px 0; font-size: 1.25rem; color: #1a202c;">
    #${i + 1} ${escapeHTML(p.title)}
  </h3>

  <img
    src="${escapeHTML(p.image || "")}"
    alt="${escapeHTML(p.title)}"
    width="220"
    height="220"
    style="
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      margin-bottom: 15px;
    "
    loading="lazy"
  />

  <p style="color: #4a5568; margin: 10px 0;">${escapeHTML(
    p.description
  )}</p>

  ${p.feature1 || p.feature2 || p.feature3
    ? `
  <ul style="color: #4a5568; margin: 10px 0 15px;">
    ${p.feature1 ? `<li>• ${escapeHTML(p.feature1)}</li>` : ""}
    ${p.feature2 ? `<li>• ${escapeHTML(p.feature2)}</li>` : ""}
    ${p.feature3 ? `<li>• ${escapeHTML(p.feature3)}</li>` : ""}
  </ul>
  `
    : ""}

  <p style="font-weight: 600; color: #2d3748; margin: 10px 0;">
    <span style="color: #22c55e;">$${price}</span> •
    <span style="color: #f59e0b;">${rating}⭐ (${reviews} reviews)</span>
  </p>

  <a
    href="https://amazon.com/dp/${p.asin}?tag=${AFFILIATE_TAG}"
    style="
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      text-align: center;
      box-shadow: 0 6px 20px rgba(239,68,68,0.4);
      transition: transform 0.2s ease;
    "
    onmouseover="this.style.transform='scale(1.05)'"
    onmouseout="this.style.transform='scale(1)'"
    target="_blank"
  >
    🛒 Buy on Amazon
  </a>
</div>
`;
}

// ——————————————————— 7. COMPARISON TABLE ———————————————————
function comparisonTable(products) {
  const top3 = products.slice(0, 3);
  return `
<div style="
  background: #f0f8ff;
  padding: 25px;
  border-radius: 12px;
  margin: 30px 0;
  border: 1px solid #bee3f8;
">
  <h3 style="margin: 0 0 15px 0;">Top 3 Models Compared</h3>

  <table style="
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  ">
    <thead style="
      background: linear-gradient(90deg, #667eea 0
      // ——————————————————— 7. COMPARISON TABLE ———————————————————
function comparisonTable(products) {
  const top3 = products.slice(0, 3);
  return `
  <div style="
    background: #f0f8ff;
    padding: 25px;
    border-radius: 12px;
    margin: 30px 0;
    border: 1px solid #bee3f8;
  ">
    <h3 style="margin: 0 0 15px 0;">Top 3 Models Compared</h3>

    <table style="
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    ">
      <thead style="
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        color: white;
      ">
        <tr>
          <th style="padding: 12px; text-align: left;">Model</th>
          <th style="padding: 12px;">Price</th>
          <th style="padding: 12px;">Rating</th>
          <th style="padding: 12px;">Best For</th>
        </tr>
      </thead>
      <tbody>
        ${top3
          .map((p) => {
            return `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: 500; color: #1a202c;">
              ${escapeHTML(p.title)}
            </td>
            <td style="padding: 12px;">$${p.price || "TBD"}</td>
            <td style="padding: 12px;">${p.rating || "4.5"}⭐</td>
            <td style="padding: 12px;">
              ${escapeHTML(p.best_for || "General use")}
            </td>
          </tr>
        `;
          })
          .join("")}
      </tbody>
    </table>
  </div>`;
}

// ——————————————————— 8. PAGE BUILDER ———————————————————
function buildPage(type, category, products, lang = "en") {
  const catName = category.name;
  const catSlug = slugify(catName);

  const typeTitleMap = {
    best: `Best ${catName} 2026`,
    top: `Top ${catName} 2026`,
    ultimate: `Ultimate ${catName} Buying Guide 2026`,
    vs: `${products[0]?.title || "Product"} vs ${products[1]?.title || "Product"}`,
    guide: `Ultimate ${catName} Guide`,
    review: `In-Depth ${products[0]?.title || "Review"} Review`,
    "2026": `Top ${catName} for 2026`,
    buying: `Best ${catName} To Buy 2026`,
    compared: `${catName} Compared`,
  };

  const baseTitle =
    typeTitleMap[type] || `Best ${catName.toLowerCase()} 2026 - ${lang.toUpperCase()}`;
  const catSlugLower = catSlug.toLowerCase();
  const seoKeywords = category.keywords.join(", ");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${baseTitle} | Best ${catName.toLowerCase()} 2026</title>
  <meta name="description" content="Best ${catName.toLowerCase()} 2026 – ${products.length} tested models. ${seoKeywords} reviewed and compared.">

  <link rel="alternate" hreflang="x-default" href="./best-${catSlugLower}-${lang}.html" />
  <link rel="canonical" href="./${type}-${catSlugLower}-${lang}.html" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "${baseTitle}",
    "itemListElement": ${JSON.stringify(
      products.slice(0, 10).map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "Product",
          "name": escapeHTML(p.title),
          "sku": "${p.asin}",
          "url": "https://amazon.com/dp/${p.asin}?tag=${AFFILIATE_TAG}"
        }
      }))
    )}
  }
  </script>
</head>

<body style="
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  max-width: 1100px;
  margin: auto;
  padding: 20px;
  background: #f9fafb;
">

<!-- HEADER -->
<header style="
  text-align: center;
  background: #ffffff;
  padding: 40px 20px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  margin-bottom: 40px;
">
  <h1 style="
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    margin: 0;
    color: #1e293b;
  ">${baseTitle}</h1>

  <p style="
    color: #64748b;
    font-size: 1.15rem;
    margin: 15px 0 0 0;
  ">
    Tested & Ranked by Experts | ${products.length} Models Compared
  </p>

  <div style="
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 16px;
  ">
    <span style="
      background: #10b981;
      color: white;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
    ">🏆 Expert Tested</span>
    <span style="
      background: #3b82f6;
      color: white;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
    ">⭐ Above 4.5 Avg</span>
    <span style="
      background: #f59e0b;
      color: white;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
    ">💰 Prime Eligible</span>
  </div>
</header>

<main style="
  background: #ffffff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
">

  <!-- COMPARISON TABLE -->
  ${comparisonTable(products)}

  <!-- PRODUCT LIST -->
  <div style="
    display: grid;
    gap: 30px;
  ">
    ${products
      .map((p, i) => productCard(p, i))
      .join("\n")}
  </div>

  <div style="
    text-align: center;
    margin-top: 50px;
    padding-top: 30px;
    border-top: 2px solid #e2e8f0;
    color: #718096;
  ">
    <p style="margin: 0 0 10px 0;">
      <strong>As an Amazon Associate we earn from qualifying purchases.</strong><br>
      <a href="index.html" style="color: #4299e1;">← All Categories</a>
    </p>
  </div>
</main>
</body>
</html>`;
}

// ——————————————————— 9. GENERATION RUNNER ———————————————————
let pageCount = 0;

Object.entries(CATEGORIES).forEach(([slug, category]) => {
  const products = loadProducts(slug);
  if (!products.length) {
    console.log(`⚠️  No products for "${slug}" – skipping...`);
    return;
  }

  LANGUAGES.forEach((lang) => {
    PAGE_TYPES.forEach((type) => {
      const pageProducts = [...products].sort(() => Math.random() - 0.5).slice(0, 8);

      const filename = `${type}-${slugify(category.name)}-${lang}.html`;
      const pageContent = buildPage(type, category, pageProducts, lang);

      fs.writeFileSync(filename, pageContent, "utf8");

      pageCount++;
      console.log(`📄 ${pageCount}: ${filename} created`);
    });
  });
});

// ——————————————————— 10. INDEX + SITEMAP ———————————————————
const indexLinksHtml = Object.entries(CATEGORIES)
  .map(
    ([slug, category]) => `
  <div style="
    background: #ffffff;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    text-align: center;
  ">
    <h2 style="color: #2d3748; font-size: 1.8rem; margin-bottom: 20px;">${category.name}</h2>
    <a href="best-${slugify(category.name)}-en.html"
       style="
         display: inline-block;
         padding: 15px 30px;
         background: #4299e1;
         color: white;
         border-radius: 12px;
         font-weight: 600;
         margin-bottom: 10px;
       ">🇺🇸 English</a>
    <a href="best-${slugify(category.name)}-es.html"
       style="
         display: inline-block;
         padding: 15px 30px;
         background: #f56565;
         color: white;
         border-radius: 12px;
         font-weight: 600;
         margin-bottom: 10px;
       ">🇪🇸 Español</a>
    <a href="best-${slugify(category.name)}-de.html"
       style="
         display: inline-block;
         padding: 15px 30px;
         background: #48bb78;
         color: white;
         border-radius: 12px;
         font-weight: 600;
       ">🇩🇪 Deutsch</a>
  </div>`
  )
  .join("\n");

fs.writeFileSync(
  "index.html",
  `<!DOCTYPE html>
<html><head>
  <title>🏆 Best Products 2026 – Expert Reviews</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #f7fafc; padding: 40px; }
  </style>
</head>
<body>
  <h1 style="text-align: center; font-size: 3rem; color: #2d3748;">Best Products 2026</h1>
  <p style="text-align: center; color: #718096; font-size: 1.3rem;">
    ${pageCount} Expert Review Pages | Generated on ${new Date().toISOString().split("T")[0]}
  </p>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1200px; margin: 60px auto;">
    ${indexLinksHtml}
  </div>
</body></html>`
);

// ——————————————————— 11. SITEMAP.XML ———————————————————
const siteUrl = "https://shopppingonline.pages.dev"; // or your GitHub Pages URL
const allFiles = fs.readdirSync(".");
const htmlFiles = allFiles.filter((f) => f.endsWith(".html"));

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ${htmlFiles
    .map(
      (file) => `
  <url>
    <loc>${siteUrl}/${file}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join("\n")}
</urlset>
`;

fs.writeFileSync("sitemap.xml", sitemapContent, "utf8");
console.log("✅ Sitemap generated: sitemap.xml");

// ——————————————————— 12. DONE ———————————————————
console.log(`\n💥 GENERATION COMPLETE!`);
console.log(`📂 ${pageCount} pages created for ${Object.keys(CATEGORIES).length} categories`);
