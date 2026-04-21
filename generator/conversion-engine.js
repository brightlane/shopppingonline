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

const pagesDir = path.join(__dirname, "../pages");

// =========================
// CTR HOOKS
// =========================
function ctrHeadline(title) {
  return `🔥 ${title} — Top Pick for 2026 (Must See Before Buying)`;
}

// =========================
// BUY INTENT BLOCK
// =========================
function buyBlock(p) {
  return `
<div style="border:2px solid #000;padding:15px;margin:20px 0;">
  <h2>⚡ Best Deal for ${p.title}</h2>
  <p>Limited availability and high demand in 2026.</p>

  <a href="https://www.amazon.com/dp/${p.asin}" target="_blank"
     style="display:inline-block;padding:10px 20px;background:#ff9900;color:#000;font-weight:bold;text-decoration:none;">
    Check Price on Amazon
  </a>

  <p><small>We may earn a commission at no extra cost to you.</small></p>
</div>
`;
}

// =========================
// TRUST SECTION
// =========================
function trustBlock() {
  return `
<h3>Why Trust This Guide?</h3>
<ul>
  <li>Real product analysis</li>
  <li>Updated for 2026 trends</li>
  <li>Buyer-focused recommendations</li>
</ul>
`;
}

// =========================
// PROCESS PAGES
// =========================
for (const p of products) {
  const filePath = path.join(pagesDir, `${p.asin}-seo.html`);

  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, "utf-8");

  // Upgrade title (CTR boost)
  html = html.replace(
    /<h1>(.*?)<\/h1>/,
    `<h1>${ctrHeadline(p.title)}</h1>`
  );

  // Inject buy block before end
  html = html.replace("</body>", `${buyBlock(p)}${trustBlock()}</body>`);

  fs.writeFileSync(filePath, html);
}

console.log("====================================");
console.log("🚀 CONVERSION ENGINE COMPLETE");
console.log("💰 CTR + Amazon blocks injected");
console.log("====================================");
