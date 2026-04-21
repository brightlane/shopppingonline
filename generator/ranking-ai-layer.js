const fs = require("fs");
const path = require("path");

// =========================
// LOAD DATA
// =========================
const feedPath = path.join(__dirname, "../feed.json");

if (!fs.existsSync(feedPath)) {
  console.error("❌ feed.json missing");
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(feedPath, "utf-8"));

// =========================
// KEYWORD BOOSTER
// =========================
function buildSEOData(title) {
  const lower = title.toLowerCase();

  let intent = "informational";

  if (lower.includes("best")) intent = "buyer-intent";
  if (lower.includes("review")) intent = "commercial-investigation";
  if (lower.includes("vs")) intent = "comparison";

  const keywords = [
    title,
    `${title} review`,
    `best ${title}`,
    `${title} 2026`,
    `buy ${title} online`
  ];

  return { intent, keywords };
}

// =========================
// TITLE OPTIMIZER
// =========================
function optimizeTitle(title) {
  if (title.length > 70) {
    return title.slice(0, 67) + "...";
  }

  if (!title.includes("2026")) {
    return `${title} (2026 Guide)`;
  }

  return title;
}

// =========================
// PROCESS PRODUCTS
// =========================
const output = [];

for (const p of products) {
  const seo = buildSEOData(p.title);

  const optimizedTitle = optimizeTitle(p.title);

  output.push({
    asin: p.asin,
    originalTitle: p.title,
    optimizedTitle,
    intent: seo.intent,
    keywords: seo.keywords
  });
}

// =========================
// SAVE OUTPUT
// =========================
fs.writeFileSync(
  path.join(__dirname, "../seo-keywords.json"),
  JSON.stringify(output, null, 2)
);

console.log("====================================");
console.log("🚀 RANKING AI LAYER COMPLETE");
console.log("📊 Pages optimized:", output.length);
console.log("🔑 SEO keyword map created");
console.log("====================================");
