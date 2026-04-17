/**
 * =========================================
 * 🔗 AUTO INTERNAL LINKING SYSTEM (2026)
 * =========================================
 * Fixes:
 * - orphan pages
 * - weak SEO structure
 * - missing cross-links
 * - category isolation
 * - low crawl depth
 * =========================================
 */

import fs from "fs";

/* =========================
   SITE STRUCTURE MAP
========================= */

const SITE_GRAPH = {
  "vacuum": [
    "best-vacuum-cleaners-en.html",
    "review-vacuum-cleaners-en.html",
    "compare-vacuum-cleaners-en.html",
    "guide-vacuum-cleaners-en.html",
    "ranking-vacuum-cleaners-en.html"
  ],
  "coffee": [
    "best-coffee-makers-en.html",
    "review-coffee-makers-en.html",
    "compare-coffee-makers-en.html",
    "guide-coffee-makers-en.html",
    "ranking-coffee-makers-en.html"
  ],
  "acne": [
    "best-acne-patches-en.html",
    "review-acne-patches-en.html",
    "compare-acne-patches-en.html",
    "guide-acne-patches-en.html",
    "ranking-acne-patches-en.html"
  ],
  "stanley": [
    "best-stanley-quencher-tumblers-en.html",
    "review-stanley-quencher-tumblers-en.html",
    "compare-stanley-quencher-tumblers-en.html",
    "guide-stanley-quencher-tumblers-en.html",
    "ranking-stanley-quencher-tumblers-en.html"
  ],
  "ring-light": [
    "best-ring-lights-for-phone-en.html",
    "review-ring-lights-for-phone-en.html",
    "compare-ring-lights-for-phone-en.html",
    "guide-ring-lights-for-phone-en.html",
    "ranking-ring-lights-for-phone-en.html"
  ]
};

/* =========================
   HUB BOOST (AUTHORITY PAGES)
========================= */

function buildHubLinks(categoryKey) {
  const pages = SITE_GRAPH[categoryKey];

  if (!pages) return "";

  return `
    <div class="seo-hub">
      <h3>🔥 Explore Full ${categoryKey.toUpperCase()} Hub</h3>
      <div class="hub-links">
        ${pages.map(p => `<a href="/${p}">${p.replace(".html","")}</a>`).join("")}
      </div>
    </div>
  `;
}

/* =========================
   CROSS CATEGORY LINKING
========================= */

function crossLinkBlock(currentCategory) {
  const all = Object.keys(SITE_GRAPH);

  return `
    <div class="cross-links">
      <h3>Explore Other Categories</h3>
      ${all
        .filter(c => c !== currentCategory)
        .map(c => `<a href="/${SITE_GRAPH[c][0]}">${c}</a>`)
        .join(" | ")}
    </div>
  `;
}

/* =========================
   PAGE ENHANCER (INJECT SEO LINKS)
========================= */

export function injectAutoLinks(html, categoryKey) {
  const hub = buildHubLinks(categoryKey);
  const cross = crossLinkBlock(categoryKey);

  return html.replace(
    "</body>",
    `
      ${hub}
      ${cross}
      </body>
    `
  );
}

/* =========================
   FILE PROCESSOR (BULK SEO FIX)
========================= */

export function processFile(filePath, categoryKey) {
  const html = fs.readFileSync(filePath, "utf-8");

  const updated = injectAutoLinks(html, categoryKey);

  fs.writeFileSync(filePath, updated);

  console.log("✅ SEO LINKS FIXED:", filePath);
}

/* =========================
   BULK RUNNER (ALL CATEGORIES)
========================= */

export function runAutoLinker() {
  Object.keys(SITE_GRAPH).forEach(category => {
    SITE_GRAPH[category].forEach(file => {
      try {
        processFile(`./${file}`, category);
      } catch (e) {
        console.log("❌ Error:", file, e.message);
      }
    });
  });

  console.log("🚀 AUTO LINKING COMPLETE");
}
