const fs = require("fs");

const baseUrl = "https://brightlane.github.io/shopppingonline/";

const categories = {
  high: [
    "vacuum-hub.html",
    "coffee-hub.html",
    "survival-hub.html"
  ],
  medium: [
    "best-vacuum-cleaners-en.html",
    "best-coffee-makers-en.html",
    "portable-power-banks.html",
    "solar-generator-kit.html"
  ],
  low: [
    "guide-vacuum-cleaners-en.html",
    "review-vacuum-cleaners-en.html",
    "vs-vacuum-cleaners-en.html"
  ]
};

function buildUrl(loc, priority) {
  return `
  <url>
    <loc>${baseUrl}${loc}</loc>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

// HIGH PRIORITY (HUBS)
categories.high.forEach(p => {
  xml += buildUrl(p, "1.0");
});

// MEDIUM PRIORITY
categories.medium.forEach(p => {
  xml += buildUrl(p, "0.8");
});

// LOW PRIORITY
categories.low.forEach(p => {
  xml += buildUrl(p, "0.6");
});

xml += `</urlset>`;

fs.writeFileSync("./sitemap.xml", xml);

console.log("Sitemap segmented generated.");
