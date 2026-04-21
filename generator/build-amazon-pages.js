const fs = require("fs");
const products = require("./amazon-products");

function buildSEOPage(product) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${product.title} Review (2026 Guide)</title>
  <meta name="description" content="Honest review of ${product.title} including features, pros, and buying guide.">
</head>

<body>

<h1>${product.title} Review</h1>

<p>
This is a detailed review of the ${product.title} in the ${product.category} category.
We analyze features, pros, and whether it is worth buying.
</p>

<h2>Overview</h2>
<p>${product.description}</p>

<h2>Key Features</h2>
<ul>
  ${product.features.map(f => `<li>${f}</li>`).join("")}
</ul>

<h2>Pros & Use Cases</h2>
<p>
This product is commonly used for everyday ${product.category.toLowerCase()} needs.
It provides reliable performance and is popular among buyers in this category.
</p>

<h2>Who Should Buy This</h2>
<p>
If you are looking for a ${product.category.toLowerCase()} solution with reliable features,
this product may be a good fit for beginners and intermediate users.
</p>

<h2>Buy on Amazon</h2>
<p>
<a href="${product.affiliateUrl}" target="_blank">
View ${product.title} on Amazon
</a>
</p>

<footer>
<p>ASIN: ${product.asin}</p>
</footer>

</body>
</html>
`;

  const filename = `${product.asin}.html`;
  fs.writeFileSync(filename, html);
  console.log("Generated:", filename);
}

// Generate all product pages
products.forEach(buildSEOPage);

// Build homepage index
const indexHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Amazon Product Review Hub</title>
</head>
<body>

<h1>Best Amazon Product Reviews</h1>

<ul>
  ${products
    .map(
      (p) =>
        `<li><a href="${p.asin}.html">${p.title}</a></li>`
    )
    .join("")}
</ul>

</body>
</html>
`;

fs.writeFileSync("index.html", indexHTML);

console.log("Index page generated");
