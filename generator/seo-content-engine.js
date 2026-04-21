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

const outputDir = path.join(__dirname, "../pages");

// =========================
// LONG SEO ARTICLE GENERATOR
// =========================
function generateArticle(p) {
  const keyword = p.title;

  return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${keyword} Review 2026 - Full Guide</title>
  <meta name="description" content="In-depth review of ${keyword}, features, pros, cons, and buying guide.">
</head>

<body>

<h1>${keyword} (2026 Full Review & Buying Guide)</h1>

<p>
If you're researching <strong>${keyword}</strong>, this guide breaks down everything you need to know before buying.
We analyzed performance, value, features, and real-world usability.
</p>

<h2>Overview</h2>
<p>
${keyword} is designed for users who want reliability, performance, and long-term value.
It stands out in its category due to its balance of price and quality.
</p>

<h2>Key Features</h2>
<ul>
  <li>High performance design</li>
  <li>Optimized for everyday use</li>
  <li>Durable build quality</li>
  <li>Strong user satisfaction ratings</li>
</ul>

<h2>Pros</h2>
<ul>
  <li>Easy to use</li>
  <li>Reliable performance</li>
  <li>Good value for money</li>
</ul>

<h2>Cons</h2>
<ul>
  <li>Limited advanced features</li>
  <li>May not suit professional users</li>
</ul>

<h2>Who Should Buy This?</h2>
<p>
This product is ideal for users looking for dependable performance without overspending.
It is especially useful for everyday consumers and beginners.
</p>

<h2>Final Verdict</h2>
<p>
Overall, ${keyword} delivers solid value and is worth considering if you're in this category.
It competes strongly with similar products in its range.
</p>

<h2>Buy Now</h2>
<p>
👉 <a href="https://www.amazon.com/dp/${p.asin}" target="_blank">Check Price on Amazon</a>
</p>

</body>
</html>
`;
}

// =========================
// BUILD PAGES
// =========================
for (const p of products) {
  const html = generateArticle(p);

  fs.writeFileSync(
    path.join(outputDir, `${p.asin}-seo.html`),
    html
  );
}

console.log("====================================");
console.log("✅ SEO CONTENT ENGINE COMPLETE");
console.log("📄 Long-form pages generated:", products.length);
console.log("====================================");
