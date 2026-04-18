/**
 * autonomous-content-rewriter.js
 * AAC Self-Improving Content Engine
 * Automatically rewrites weak SEO pages using performance signals
 */

const fs = require("fs");
const path = require("path");

// === CONFIG ===
const DIST_DIR = path.join(__dirname, "dist");
const MONITOR_REPORT = path.join(__dirname, "cache/deploy-report.json");

// === ENTRY POINT ===
function runRewriter() {
  console.log("🧠 Running Autonomous Content Rewriter...");

  const report = loadReport();

  if (!report) {
    console.log("⚠️ No report found. Run deployment-monitor first.");
    return;
  }

  const weakPages = report.weak || [];

  weakPages.forEach(file => {
    const filePath = path.join(DIST_DIR, file);

    if (!fs.existsSync(filePath)) return;

    const html = fs.readFileSync(filePath, "utf8");

    const improved = rewritePage(html);

    fs.writeFileSync(filePath, improved, "utf8");

    console.log(`✏️ Rewritten: ${file}`);
  });

  console.log("✅ Content Rewrite Complete");
}

// === LOAD DEPLOYMENT REPORT ===
function loadReport() {
  try {
    if (!fs.existsSync(MONITOR_REPORT)) return null;
    return JSON.parse(fs.readFileSync(MONITOR_REPORT, "utf8"));
  } catch (err) {
    return null;
  }
}

// === CORE REWRITE ENGINE ===
function rewritePage(html) {
  let updated = html;

  // 1. Improve title if weak
  updated = improveTitle(updated);

  // 2. Expand thin content
  updated = expandContent(updated);

  // 3. Strengthen CTA
  updated = enhanceCTA(updated);

  // 4. Inject SEO paragraph if missing
  updated = injectSEOBlock(updated);

  return updated;
}

// === TITLE OPTIMIZATION ===
function improveTitle(html) {
  if (!html.includes("<title>")) return html;

  return html.replace(
    /<title>(.*?)<\/title>/,
    (match, title) => {
      if (title.length < 20) {
        return `<title>Best ${title} Review 2026 (Top Rated Guide)</title>`;
      }
      return match;
    }
  );
}

// === CONTENT EXPANSION ===
function expandContent(html) {
  if (html.length > 2000) return html;

  const expansion = `
<div style="margin-top:20px;">
  <h2>Why This Product Matters</h2>
  <p>
    This product is ranked based on performance, durability, and user satisfaction.
    Our system continuously updates rankings based on real-world data signals.
  </p>

  <h3>Key Benefits</h3>
  <ul>
    <li>High performance verified across multiple datasets</li>
    <li>Optimized for value and long-term usage</li>
    <li>Frequently updated based on user engagement signals</li>
  </ul>
</div>
`;

  return html.replace("</body>", expansion + "\n</body>");
}

// === CTA ENHANCEMENT ===
function enhanceCTA(html) {
  if (html.includes("amazon")) return html;

  const cta = `
<div style="padding:20px;text-align:center;">
  <a href="https://www.amazon.com/?tag=brightlane201-20"
     style="background:#ff9900;padding:14px 22px;color:black;font-weight:bold;text-decoration:none;border-radius:10px;">
     Check Current Price on Amazon
  </a>
</div>
`;

  return html.replace("</body>", cta + "\n</body>");
}

// === SEO BLOCK INJECTION ===
function injectSEOBlock(html) {
  if (html.includes("SEO BOOST BLOCK")) return html;

  const seoBlock = `
<!-- SEO BOOST BLOCK -->
<section>
  <h2>Expert Buying Guide</h2>
  <p>
    This page is automatically optimized using AAC intelligence signals,
    including CTR performance, engagement tracking, and category ranking data.
  </p>
</section>
`;

  return html.replace("</body>", seoBlock + "\n</body>");
}

// === EXPORT ===
module.exports = {
  runRewriter
};

// === AUTO RUN ===
if (require.main === module) {
  runRewriter();
}
