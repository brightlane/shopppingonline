const fs = require("fs");

// Example feed data (replace later with real Amazon/JSON/API feed)
const feed = [
  {
    title: "Best Coffee Makers 2026",
    url: "best-coffee-makers-2026-model-1.html"
  },
  {
    title: "Top Vacuum Cleaners 2026",
    url: "best-vacuum-cleaners-2026-model-1.html"
  },
  {
    title: "Smart Home Devices Guide",
    url: "best-smart-home-2026-model-1.html"
  }
];

// Write feed JSON for your generator system
fs.writeFileSync(
  "feed.json",
  JSON.stringify(feed, null, 2)
);

console.log("✅ Feed generated successfully");

// Optional: also output sitemap-style links
const sitemap = feed.map(item => {
  return `<url><loc>https://yourdomain.com/${item.url}</loc></url>`;
}).join("\n");

fs.writeFileSync("feed-sitemap.xml", sitemap);

console.log("✅ Feed sitemap generated");
