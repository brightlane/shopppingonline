const fs = require("fs");
const products = require("./amazon-products");

const urls = products
  .map(
    (p) => `
  <url>
    <loc>https://yourdomain.com/${p.asin}.html</loc>
  </url>
`
  )
  .join("");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

fs.writeFileSync("sitemap.xml", sitemap);

console.log("Sitemap updated");
