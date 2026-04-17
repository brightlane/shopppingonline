const fs = require("fs");

const AFFILIATE_TAG = "brightlane201-20";

const LANGUAGES = ["en", "es", "de"];

const PAGE_TYPES = [
  "best", "top", "ultimate", "vs", "guide", "review",
  "buying", "compared", "showdown", "battle", "ranking",
  "picks", "choices"
];

const CATEGORIES = {
  vacuum: { name: "Vacuum Cleaners", keywords: ["cordless vacuum", "robot vacuum"] },
  coffee: { name: "Coffee Makers", keywords: ["espresso", "drip coffee"] },
  stanley: { name: "Stanley Quencher Tumblers", keywords: ["stanley cup", "tumbler"] },
  acne_patch: { name: "Acne Patches", keywords: ["acne patch", "pimple patch"] },
  ring_light: { name: "Ring Lights for Phone", keywords: ["ring light", "phone light"] },
};

/* ---------------- UTIL ---------------- */

function escapeHTML(str = "") {
  return str.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/* ---------------- AMAZON LINK LOCK ---------------- */

function amazonUrl(asin) {
  if (!asin) return "#";
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

/* ---------------- DEDUP ---------------- */

function removeDuplicateASIN(products) {
  const seen = new Set();
  return products.filter(p => {
    if (!p.asin || seen.has(p.asin)) return false;
    seen.add(p.asin);
    return true;
  });
}

/* ---------------- LOAD PRODUCTS ---------------- */

function loadProducts(cat) {
  try {
    return JSON.parse(fs.readFileSync(`products-${cat}.json`, "utf8"));
  } catch {
    return [];
  }
}

/* ---------------- AI-LIKE DESCRIPTION GENERATOR ---------------- */

function generateDescription(p, category) {
  const base = {
    vacuum: "Designed for powerful deep cleaning, strong suction, and modern filtration systems.",
    coffee: "Engineered for consistent brewing, rich flavor extraction, and everyday reliability.",
    stanley: "Built for extreme durability and long-lasting temperature retention.",
    acne_patch: "Targets breakouts quickly using advanced hydrocolloid absorption technology.",
    ring_light: "Enhances lighting for creators, streaming, photography, and video calls."
  };

  const emotionBoost = [
    "Best-selling in its category",
    "Highly trusted by thousands of users",
    "Strong performance-to-price ratio",
    "Consistently top-rated by buyers"
  ];

  return `${base[category] || "Reliable high-performance product."} ${emotionBoost[Math.floor(Math.random()*emotionBoost.length)]}.`;
}

/* ---------------- FAQ SYSTEM ---------------- */

function generateFAQ(categoryName) {
  return [
    {
      q: `What is the best ${categoryName} in 2026?`,
      a: `The best ${categoryName.toLowerCase()} depends on your needs, but top-rated models offer strong performance, durability, and value.`
    },
    {
      q: `Are expensive ${categoryName.toLowerCase()} worth it?`,
      a: `Higher-priced models usually provide better build quality, longer lifespan, and improved performance.`
    },
    {
      q: `How do I choose the right ${categoryName.toLowerCase()}?`,
      a: `Focus on reviews, features, and how well it matches your daily usage needs.`
    }
  ];
}

/* ---------------- PRODUCT SCHEMA ---------------- */

function productSchema(p) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": p.title,
    "image": p.image,
    "description": p.description,
    "offers": {
      "@type": "Offer",
      "price": p.price || "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": amazonUrl(p.asin)
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": p.rating || "4.5",
      "reviewCount": p.reviews || "1000"
    }
  };
}

/* ---------------- PROTECTED HEAD ---------------- */

function protectedHead() {
  return `
<meta name="google-site-verification" content="YOUR-CODE-HERE" />
<meta name="msvalidate.01" content="BING-CODE-HERE" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://brightlane.github.io/shopppingonline/" />
`;
}

/* ---------------- INTERNAL LINKS ---------------- */

function internalLinks(catSlug, type, lang) {
  return `
<div style="margin-top:40px;padding:20px;background:#f1f5f9;border-radius:10px;">
<h3>Explore more</h3>
<a href="best-${catSlug}-${lang}.html">Best</a> |
<a href="review-${catSlug}-${lang}.html">Reviews</a> |
<a href="guide-${catSlug}-${lang}.html">Guide</a> |
<a href="vs-${catSlug}-${lang}.html">Compare</a>
</div>
`;
}

/* ---------------- PRODUCT CARD ---------------- */

function productCard(p, i, category) {
  const link = amazonUrl(p.asin);

  return `
<div style="background:#fff;padding:20px;margin:15px 0;border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,0.08);display:flex;gap:20px;">

<a href="${link}" target="_blank">
<img src="${p.image}" style="width:200px;height:200px;object-fit:cover;border-radius:12px;">
</a>

<div style="flex:1;">
<h3>#${i} ${escapeHTML(p.title)}</h3>

<p>${p.description}</p>

<p><b>$${p.price}</b> • ⭐ ${p.rating} (${p.reviews})</p>

<a href="${link}" target="_blank"
style="display:inline-block;padding:10px 15px;background:#ff4d00;color:#fff;border-radius:8px;text-decoration:none;">
Buy on Amazon
</a>

</div>
</div>
`;
}

/* ---------------- PAGE BUILDER ---------------- */

function buildPage(type, catSlug, cat, products, lang) {

  const title = `${type.toUpperCase()} ${cat.name} 2026`;

  const enriched = products.map(p => ({
    ...p,
    category: catSlug,
    description: generateDescription(p, catSlug)
  }));

  const faqs = generateFAQ(cat.name);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": title,
    "itemListElement": enriched.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": amazonUrl(p.asin)
    }))
  };

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${title}</title>

${protectedHead()}

<script type="application/ld+json">
${JSON.stringify(schema)}
</script>

</head>

<body style="font-family:system-ui;background:#f8fafc;max-width:1000px;margin:auto;padding:20px;">

<h1>${title}</h1>

${enriched.map((p,i)=>productCard(p,i+1,catSlug)).join("")}

<!-- FAQ -->
<div style="margin-top:40px;">
<h2>FAQs</h2>
${faqs.map(f=>`
<h4>${f.q}</h4>
<p>${f.a}</p>
`).join("")}
</div>

${internalLinks(catSlug,type,lang)}

</body>
</html>
`;
}

/* ---------------- GENERATION ---------------- */

let pageCount = 0;
let sitemapUrls = [];

Object.entries(CATEGORIES).forEach(([slug, cat]) => {

  const products = removeDuplicateASIN(loadProducts(slug));

  PAGE_TYPES.forEach(type => {
    LANGUAGES.forEach(lang => {

      const file = `${type}-${slug}-${lang}.html`;

      const html = buildPage(type, slug, cat, products.slice(0,6), lang);

      fs.writeFileSync(file, html);

      sitemapUrls.push({
        file,
        type
      });

      pageCount++;
    });
  });
});

/* ---------------- INDEX ---------------- */

fs.writeFileSync("index.html", `
<!DOCTYPE html>
<html>
<head>
<title>Best Products 2026</title>
${protectedHead()}
</head>

<body style="font-family:system-ui;padding:40px;background:#f7fafc;">

<h1>Best Products 2026</h1>
<p>${pageCount} pages generated</p>

${Object.entries(CATEGORIES).map(([slug,cat])=>`
<div>
<h3>${cat.name}</h3>
<a href="best-${slug}-en.html">Start</a>
</div>
`).join("")}

</body>
</html>
`);

/* ---------------- SITEMAP (SEGMENTED PRIORITY) ---------------- */

const priorityMap = {
  best: 1.0,
  top: 0.95,
  ultimate: 0.95,
  guide: 0.9,
  review: 0.9,
  vs: 0.85,
  ranking: 0.85,
  buying: 0.85,
  default: 0.7
};

const urls = sitemapUrls.map(u => `
<url>
<loc>https://brightlane.github.io/shopppingonline/${u.file}</loc>
<priority>${priorityMap[u.type] || 0.7}</priority>
</url>
`).join("");

fs.writeFileSync("sitemap.xml", `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);

console.log("DONE:", pageCount);
