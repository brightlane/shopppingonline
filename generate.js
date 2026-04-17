const fs = require("fs");

// ——————————————————— 1. SETUP & LOGGING ———————————————————
console.log("🚀 NUCLEAR GENERATOR: 3K-PAGE AFFILIATE STORE");
console.log("📂 Current directory:", __dirname);

// ——————————————————— 2. CONFIG ———————————————————
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

// ——————————————————— 3. CATEGORIES (add acne_patch here) ———————————————————
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
</div>
  `;
}

// ——————————————————— 8. PAGE BUILDER ———————————————————
function buildPage(type, category, products, lang = "en") {
  const catName = category.name;
  const catSlug = slugify(catName);

  const titleMap = {
    best: `Best ${catName} 2026`,
    top: `Top ${catName} 2026`,
    ultimate: `Ultimate ${catName} Buying Guide 2026`,
    vs: `${products[0]?.title || "Product"} vs ${products[1]?.title || "Product"}`,
    guide: `Ultimate ${catName.replace("Patches", "Sheet")} Guide`,
    review: `In-Depth ${products[0]?.title || "Review"} Review`,
    "2026": `Top ${catName} for 2026`,
    "buying": `Best ${catName} To Buy 2026`,
    compared: `${catName} Compared`,
  };

  const baseTitle = titleMap[type] || `Best ${catName} ${lang === "es" ? "2026" : "2026"}`;
  const seoKeywordsPart = category.keywords.slice(0, 4).join(", ");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${baseTitle} | Best ${catName.toLowerCase()} 2026</title>
  <meta name="description" content="Best ${catName.toLowerCase()} 2026 – ${products.length} tested models. ${seoKeywordsPart} reviewed and compared.">

  <link rel="alternate" hreflang="x-default" href="./best-${catSlug}-${lang}.html" />
  <link rel="canonical" href="./${type}-${catSlug}-${lang}.html" />
