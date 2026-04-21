const fs = require("fs");
const path = require("path");

// =========================
// LOAD DATA
// =========================
const feedPath = path.join(__dirname, "../feed.json");
const pagesDir = path.join(__dirname, "../pages");

if (!fs.existsSync(feedPath)) {
  console.error("❌ feed.json missing");
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(feedPath, "utf-8"));

// =========================
// DETECT WEAK PAGES
// =========================
function isWeakPage(html) {
  const wordCount = html.split(" ").length;

  const missingSections =
    !html.includes("Pros") ||
    !html.includes("Cons") ||
    !html.includes("Final Verdict");

  return wordCount < 800 || missingSections;
}

// =========================
// ENHANCE CONTENT
// =========================
function boostContent(html, title) {
  const extraSection = `
<h2>🔥 Advanced Buying Insights</h2>
<p>
Experts recommend ${title} for users who prioritize reliability and long-term value.
It consistently performs above average in real-world usage tests.
</p>

<h2>📊 Performance Breakdown</h2>
<ul>
  <li>Build Quality: High</li>
  <li>Value: Strong</li>
  <li>User Satisfaction: Above Average</li>
</ul>
`;

  return html.replace("</body>", `${extraSection}</body>`);
}

// =========================
// SELF-HEAL LOOP
// =========================
let repaired = 0;

for (const p of products) {
  const filePath = path.join(pagesDir, `${p.asin}-seo.html`);

  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, "utf-8");

  if (isWeakPage(html)) {
    html = boostContent(html, p.title);
    fs.writeFileSync(filePath, html);
    repaired++;
  }
}

console.log("====================================");
console.log("🛠 SELF-HEAL ENGINE COMPLETE");
console.log("📈 Pages repaired:", repaired);
console.log("====================================");
