const fs = require("fs");
const products = require("./amazon-products");

// safety check
if (!products || !products.length) {
  console.error("No products found in amazon-products.js");
  process.exit(1);
}

// build URL entries
const urls = products
  .map((p) => {
    return `
  <url>
    <loc>https://yourdomain.com/${p.asin}.html</loc>
  </url>`;
  })
  .join("");

// full sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

// write file to ROOT of project
fs.writeFileSync("sitemap.xml", sitemap.trim());

console.log("✅ Sitemap generated successfully");
