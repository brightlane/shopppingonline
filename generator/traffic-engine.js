const fs = require("fs");
const path = require("path");

// =========================
// LOAD DATA
// =========================
const feedPath = path.join(__dirname, "../feed.json");
const outputDir = path.join(__dirname, "../pages");

if (!fs.existsSync(feedPath)) {
  console.error("❌ feed.json missing");
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(feedPath, "utf-8"));

// =========================
// KEYWORD EXPANSION LOGIC
// =========================
function expandKeywords(title) {
  const base = title.toLowerCase();

  return [
    `best ${base}`,
    `${base} review 2026`,
    `${base} vs competitors`,
    `cheap ${base}`,
    `${base} amazon deal`,
    `top rated ${base}`
  ];
}

// =========================
// PAGE GENERATOR (LIGHTWEIGHT LANDING PAGES)
// =========================
function buildPage(p, keyword) {
  return `
<!doctype html>
<html>
<head>
  <title>${keyword} - Ultimate Guide 2026</title>
  <meta name="description" content="Discover ${keyword} with comparisons, pricing, and buying insights.">
</head>

<body>

<h1>🔥 ${keyword}</h1>

<p>
This page is built to target high-intent search traffic for:
<strong>${keyword}</strong>
</p>

<h2>Why This Matters</h2>
<p>
Search demand for this category continues to grow in 2026, especially among buyers looking for value and performance.
</p>

<h2>Top Recommendation</h2>

<div style="border:1px solid #ccc;padding:15px;">
  <h3>${p.title}</h3>
  <a href="https://www.amazon.com/dp/${p.asin}" target="_blank">
    👉 Check Price on Amazon
  </a>
</div>

<h2>Buying Insight</h2>
<ul>
  <li>High demand product category</li>
  <li>Strong buyer intent keyword</li>
  <li>Competitive pricing on Amazon</li>
</ul>

</body>
</html>
`;
}

// =========================
// GENERATE NEW TRAFFIC PAGES
// =========================
let created = 0;

for (const p of products) {
  const keywords = expandKeywords(p.title);

  for (const kw of keywords) {
    const slug = kw.replace(/\s+/g, "-").replace(/[^a-z0-9-]/gi, "");

    const filePath = path.join(outputDir, `${slug}.html`);

    if (fs.existsSync(filePath)) continue;

    const html = buildPage(p, kw);

    fs.writeFileSync(filePath, html);
    created++;
  }
}

console.log("====================================");
console.log("🚀 TRAFFIC ENGINE COMPLETE");
console.log("📈 New pages created:", created);
console.log("🌍 Site expansion active");
console.log("====================================");
