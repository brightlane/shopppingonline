const fs = require("fs");
const products = require("./amazon-products");

// group products by category
const categories = {};

products.forEach((p) => {
  if (!categories[p.category]) categories[p.category] = [];
  categories[p.category].push(p);
});

function buildProductPage(product) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${product.title} Review (2026 Guide)</title>
  <meta name="description" content="Detailed review of ${product.title}">
</head>

<body>

<a href="index.html">Home</a>

<h1>${product.title}</h1>

<p>${product.description}</p>

<h2>Features</h2>
<ul>
  ${product.features.map((f) => `<li>${f}</li>`).join("")}
</ul>

<h2>Category: ${product.category}</h2>

<h3>More in this category</h3>
<ul>
  ${categories[product.category]
    .filter((p) => p.asin !== product.asin)
    .map((p) => `<li><a href="${p.asin}.html">${p.title}</a></li>`)
    .join("")}
</ul>

<h2>Buy on Amazon</h2>
<a href="${product.affiliateUrl}" target="_blank">View Product</a>

</body>
</html>
`;

  fs.writeFileSync(`${product.asin}.html`, html);
  console.log("Generated:", product.asin);
}

// generate product pages
products.forEach(buildProductPage);

// build category pages
Object.keys(categories).forEach((cat) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${cat} Products</title>
</head>

<body>

<h1>${cat} Products</h1>

<ul>
  ${categories[cat]
    .map((p) => `<li><a href="${p.asin}.html">${p.title}</a></li>`)
    .join("")}
</ul>

<a href="index.html">Back Home</a>

</body>
</html>
`;

  fs.writeFileSync(`${cat.toLowerCase()}.html`, html);
});

// homepage
const indexHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Amazon Product Review Hub</title>
</head>

<body>

<h1>Top Product Categories</h1>

<ul>
  ${Object.keys(categories)
    .map((c) => `<li><a href="${c.toLowerCase()}.html">${c}</a></li>`)
    .join("")}
</ul>

</body>
</html>
`;

fs.writeFileSync("index.html", indexHTML);

// sitemap
const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${products
  .map(
    (p) => `
  <url>
    <loc>https://yourdomain.com/${p.asin}.html</loc>
  </url>
`
  )
  .join("")}
</urlset>
`;

fs.writeFileSync("sitemap.xml", sitemap);

console.log("Sitemap generated");
