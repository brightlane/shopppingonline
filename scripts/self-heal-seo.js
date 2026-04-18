/**
 * self-heal-seo.js
 * AAC Self-Healing SEO Layer
 * Detects weak, broken, or outdated pages and regenerates them
 */

const fs = require("fs");
const path = require("path");

// === ENTRY POINT ===
function runSelfHeal() {
  console.log("🧠 Running Self-Healing SEO System...");

  const pagesDir = path.join(__dirname, "../dist");

  if (!fs.existsSync(pagesDir)) {
    console.log("⚠️ No dist folder found. Skipping.");
    return;
  }

  const files = fs.readdirSync(pagesDir);

  const issues = [];

  files.forEach(file => {
    const filePath = path.join(pagesDir, file);

    if (!file.endsWith(".html")) return;

    const content = fs.readFileSync(filePath, "utf8");

    const result = analyzePage(content, file);

    if (result.needsFix) {
      issues.push({
        file,
        reason: result.reason
      });

      const fixed = fixPage(content);
      fs.writeFileSync(filePath, fixed, "utf8");
    }
  });

  console.log("✅ Self-Heal Complete");
  console.log("Fixed Pages:", issues.length);
}

// === PAGE ANALYZER ===
function analyzePage(html, file) {
  let score = 0;
  let reason = [];

  if (!html.includes("<title>")) {
    score -= 2;
    reason.push("missing title");
  }

  if (!html.includes("amazon")) {
    score -= 2;
    reason.push("no affiliate link");
  }

  if (html.length < 800) {
    score -= 2;
    reason.push("thin content");
  }

  if (!html.includes("img")) {
    score -= 1;
    reason.push("no image");
  }

  return {
    needsFix: score < -2,
    reason: reason.join(", ")
  };
}

// === AUTO FIX ENGINE ===
function fixPage(html) {
  let fixed = html;

  // ensure basic SEO tags exist
  if (!fixed.includes("<meta name=\"description\"")) {
    fixed = fixed.replace(
      "<head>",
      `<head><meta name="description" content="Top rated Amazon product review and comparison">`
    );
  }

  // inject fallback affiliate CTA if missing
  if (!fixed.includes("amazon.com")) {
    fixed = fixed.replace(
      "</body>",
      `
<div style="padding:20px;text-align:center;">
  <a href="https://www.amazon.com/?tag=brightlane201-20" target="_blank"
     style="background:#ff9900;padding:12px 18px;color:black;font-weight:bold;text-decoration:none;border-radius:8px;">
     View on Amazon
  </a>
</div>
</body>`
    );
  }

  return fixed;
}

// === EXPORT ===
module.exports = {
  runSelfHeal
};

// === AUTO RUN ===
if (require.main === module) {
  runSelfHeal();
}
