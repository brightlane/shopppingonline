const fs = require("fs");

// 1. CONFIG (Affiliate ID)
const AFFILIATE_TAG = "brightlane201-20";
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

// 2. CATEGORIES
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

// 3. HELPERS
function escapeHTML(str = "") {
  return str
    .toString()
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

// 4. LOAD PRODUCTS
function loadProducts(cat) {
  const fn = `products-${cat}.json`;
  try {
    const raw = fs.readFileSync(fn, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.log(`⚠️ Missing ${fn} (using dummy ${cat})`);
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
  ],
  stanley: [
    {
      title: "Stanley Quencher H2.0 40oz",
      asin: "B0CGRCP4ML",
      image: "https://m.media-amazon.com/images/I/71g7z7y5sKL._AC_SL1500_.jpg",
      price: "45",
      rating: "4.8",
      reviews: "125000",
      description: "Viral 40oz Stanley tumbler, ice 48+ hours.",
      best_for: "Gym, office, travel",
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
      description: "Hydrocolloid acne patch — overnight spot healing.",
      best_for: "Pimple overnight",
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
      description: "Portable USB ring light with tripod for TikTok, Instagram, YouTube.",
      best_for: "TikTok creators",
    },
  ],
};

// 5. PRODUCT CARD
function productCard(p, i) {
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

  <img src="${escapeHTML(p.image || "")}"
       alt="${escapeHTML(p.title)}"
       width="220" height="220"
       style="border-radius:10px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); margin-bottom:15px;"
       loading="lazy">

  <p style="color: #4a5568; margin:10px 0;">${escapeHTML(p.description)}</p>

  <p style="font-weight:600; color: #2d3748; margin:10px 0;">
    <span style="color: #22c55e;">$${p.price || "TBD"}</span> •
    <span style="color: #f59e0b;">${p.rating || "4.5"}⭐ (${p.reviews || "1000+"} reviews)</span>
  </p>

  <a href="https://amazon.com/dp/${p.asin}?tag=${AFFILIATE_TAG}"
     style="display:inline-block; padding:12px 24px; background:linear-gradient(135deg,#ef4444,#dc2626); color:white; border-radius:8px; text-decoration:none; font-weight:600; text-align:center; box-shadow:0 6px 20px rgba(239,68,68,0.4); transition:transform 0.2s ease;"
     onmouseover="this.style.transform='scale(1.05)'"
     onmouseout="this.style.transform='scale(1)'"
     target="_blank">
    🛒 Buy on Amazon
  </a>
</div>`;
}

// 6. COMPARISON TABLE
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
  <h3>Top 3 Models Compared</h3>

  <table style="width:100%; border-collapse:collapse; font-size:14px;">
    <thead style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); color: white;">
      <tr>
        <th style="padding:12px; text-align:left;">Model</th>
        <th style="padding:12px;">Price</th>
        <th style="padding:12px;">Rating</th>
        <th style="padding:12px;">Best For</th>
      </tr>
    </thead>
    <tbody>
      ${top3
        .map(
          (p) => `
      <tr style="border-bottom:1px solid #e2e8f0;">
        <td style="padding:12px; font-weight:500; color:#1a202c;">${escapeHTML(p.title)}</td>
        <td style="padding:12px;">$${p.price || "TBD"}</td>
        <td style="padding:12px;">${p.rating || "4.5"}⭐</td>
        <td style="padding:12px;">${escapeHTML(p.best_for || "General use")}</td>
      </tr>`
        )
        .join("\n")}
    </tbody>
  </table>
</div>`;
}

// 7. BUILD PAGE (entire HTML string in one template literal)
function buildPage(type, category, products, lang = "en") {
  const catName = category.name;
  const catSlug = slugify(catName);
  const title =
    {
      best: `Best ${catName} 2026`,
      top: `Top ${catName} 2026`,
      ultimate: `Ultimate ${catName} Guide 2026`,
      vs: `${products[0]?.title ?? "Product"} vs ${products[1]?.title ?? "Product"}`,
      guide: `Ultimate ${catName} Guide`,
      review: `Review: ${products[0]?.title ?? ""}`,
      "2026": `Top ${catName} 2026`,
      buying: `Best ${catName} To Buy 2026`,
      compared: `${catName} Compared`,
    }[type] || catName;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">

  <title>${title} | Best ${catName.toLowerCase()} 2026</title>
  <meta name="description" content="Best ${catName.toLowerCase()} 2026 – ${products.length} models reviewed. ${category.keywords.slice(0,5).join(", ")}." />

  <link rel="alternate" hreflang="x-default" href="./best-${catSlug}-${lang}.html" />
  <link rel="canonical" href="./${type}-${catSlug}-${lang}.html" />
</head>
<body style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:1000px;margin:auto;padding:20px;background:#f8fafc;">

<header style="text-align:center;padding:40px;background:#ffffff;border-radius:16px;margin-bottom:40px;box-shadow:0 10px 40px rgba(0,0,0,0.1);">
  <h1 style="margin:0;font-size:2.5rem;color:#1a202c;">${title}</h1>
  <p style="color:#718096;font-size:1.15rem;margin:15px 0 0 0;">Tested & Ranked | ${products.length} Models Compared</p>
</header>

<main style="background:#ffffff;padding:40px;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.1);">

  ${comparisonTable(products)}

  <div style="display:grid;gap:30px;">
    ${products.map((p, i) => productCard(p, i + 1)).join("\n")}
  </div>

  <div style="text-align:center;margin-top:50px;padding-top:30px;border-top:2px solid #e2e8f0;color:#718096;">
    <p style="margin:0;">
      <strong>As an Amazon Associate we earn from qualifying purchases.</strong><br>
      <a href="index.html" style="color:#4299e1;">← All Categories</a>
    </p>
  </div>
</main>

</body>
</html>`;
}

// 8. GENERATE PAGES
let pageCount = 0;

Object.entries(CATEGORIES).forEach(([slug, category]) => {
  const products = loadProducts(slug);
  if (!products.length) {
    console.log(`⚠️  No products for ${slug}`);
    return;
  }

  LANGUAGES.forEach((lang) => {
    PAGE_TYPES.forEach((type) => {
      const pageProducts = [...products].sort(() => Math.random() - 0.5).slice(0, 8);
      const filename = `${type}-${slugify(category.name)}-${lang}.html`;
      const html = buildPage(type, category, pageProducts, lang);
      fs.writeFileSync(filename, html, "utf8");
      pageCount++;
      console.log(`📄 ${pageCount}: ${filename}`);
    });
  });
});

// 9. INDEX PAGE
fs.writeFileSync(
  "index.html",
  `<!DOCTYPE html>
<html><head>
  <title>🏆 Best Products 2026 – Expert Reviews</title>
  <meta name="viewport" content="width=device-width">
  <style>body{font-family:system-ui,sans-serif;background:#f7fafc;padding:40px;}</style>
</head>
<body>
  <h1 style="text-align:center;font-size:3rem;color:#2d3748;">Best Products 2026</h1>
  <p style="text-align:center;color:#718096;">${pageCount} SEO Pages | Updated ${new Date().toISOString().split("T")[0]}</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:30px;max-width:1200px;margin:60px auto;">
    ${Object.entries(CATEGORIES)
      .map(
        ([slug, cat]) => `
    <div style="background:#ffffff;padding:40px;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.1);">
      <h2 style="color:#2d3748;font-size:1.8rem;margin-bottom:20px;">${cat.name}</h2>
      <a href="best-${slugify(cat.name)}-en.html" style="display:block;padding:15px 30px;background:#4299e1;color:white;border-radius:12px;font-weight:600;margin-bottom:10px;">🇺🇸 English</a>
      <a href="best-${slugify(cat.name)}-es.html" style="display:block;padding:15px 30px;background:#f56565;color:white;border-radius:12px;font-weight:600;margin-bottom:10px;">🇪🇸 Español</a>
      <a href="best-${slugify(cat.name)}-de.html" style="display:block;padding:15px 30px;background:#48bb78;color:white;border-radius:12px;font-weight:600;">🇩🇪 Deutsch</a>
    </div>`
      )
      .join("\n")}
  </div>
</body></html>`
);

// 10. SITEMAP
const siteUrl = "https://brightlane.github.io/shopppingonline"; // update if needed
const files = fs.readdirSync(".");
const urls = files
  .filter((f) => f.endsWith(".html"))
  .map(
    (f) => `
  <url>
    <loc>${siteUrl}/${f}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join("\n");

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.s
// 10. SITEMAP
const siteUrl = "https://brightlane.github.io/shopppingonline"; // update if needed
const files = fs.readdirSync(".");
const urls = files
  .filter((f) => f.endsWith(".html"))
  .map(
    (f) => `
  <url>
    <loc>${siteUrl}/${f}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join("\n");

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>${urls}
</urlset>
`;

fs.writeFileSync("sitemap.xml", sitemapContent, "utf8");
console.log("✅ sitemap.xml generated");

console.log(`\n💥 GENERATION COMPLETE!`);
console.log(`📂 ${pageCount} pages created for ${Object.keys(CATEGORIES).length} categories`);
