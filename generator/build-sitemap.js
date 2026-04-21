const fs = require("fs");
const path = require("path");

// =========================
// CONFIG
// =========================
const pagesDir = path.join(__dirname, "../pages");
const outputFile = path.join(__dirname, "../sitemap.xml");

// =========================
// CHECK PAGES
// =========================
if (!fs.existsSync(pagesDir)) {
  console.error("❌ pages folder not found. Run build-pages.js first.");
  process.exit(1);
}

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith(".html"));

// =========================
// BASE URL (CHANGE THIS)
// =========================
const BASE_URL = "https://yourdomain.com/pages";

// =========================
// BUILD SITEMAP URLS
// =========================
const urls = files.map(file => {
  return `
  <url>
    <loc>${BASE_URL}/${file}</loc>
  </url>`;
}).join("\n");

// =========================
// FINAL XML
// =========================
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

// =========================
// WRITE FILE
// =========================
fs.writeFileSync(outputFile, sitemap);

console.log("====================================");
console.log("✅ SITEMAP GENERATED");
console.log("📄 Pages indexed:", files.length);
console.log("📁 Output:", outputFile);
console.log("====================================");
