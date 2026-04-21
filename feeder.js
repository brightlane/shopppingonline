const fs = require("fs");

// Central feed source (this drives ALL page generation)
const feed = [
  {
    id: "coffee-makers",
    title: "Best Coffee Makers 2026",
    keyword: "coffee makers",
    category: "kitchen-appliances",
    url: "best-coffee-makers-2026-model-1.html",
    description: "High-quality coffee makers ranked for 2026 buyers and Amazon shoppers."
  },
  {
    id: "vacuum-cleaners",
    title: "Best Vacuum Cleaners 2026",
    keyword: "vacuum cleaners",
    category: "home-cleaning",
    url: "best-vacuum-cleaners-2026-model-1.html",
    description: "Top rated vacuum cleaners for home and commercial use."
  },
  {
    id: "smart-home",
    title: "Best Smart Home Devices 2026",
    keyword: "smart home devices",
    category: "smart-home",
    url: "best-smart-home-2026-model-1.html",
    description: "Smart home automation devices ranked and reviewed."
  },
  {
    id: "portable-power",
    title: "Best Portable Power Stations 2026",
    keyword: "portable power station",
    category: "electronics",
    url: "best-portable-power-2026-model-1.html",
    description: "Reliable portable power solutions for outdoor and emergency use."
  }
];

// 1. Save main feed JSON
fs.writeFileSync("feed.json", JSON.stringify(feed, null, 2));
console.log("✅ feed.json created");

// 2. Create sitemap entries for SEO
const sitemap = feed
  .map(item => {
    return `
  <url>
    <loc>https://yourdomain.com/${item.url}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
  })
  .join("\n");

const sitemapFinal = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap}
</urlset>`;

fs.writeFileSync("feed-sitemap.xml", sitemapFinal);
console.log("✅ feed-sitemap.xml created");

// 3. Optional: category index for generator logic
const categories = {};

for (const item of feed) {
  if (!categories[item.category]) {
    categories[item.category] = [];
  }
  categories[item.category].push(item);
}

fs.writeFileSync("feed-categories.json", JSON.stringify(categories, null, 2));
console.log("✅ feed-categories.json created");

// 4. Logging
console.log("🚀 Feed system complete. Ready for generator.");
