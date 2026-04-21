const fs = require("fs");
const path = require("path");
const products = require("./amazon-products");

// -------------------------
// GROUP PRODUCTS BY CATEGORY
// -------------------------
const categories = {};

products.forEach((p) => {
  if (!categories[p.category]) {
    categories[p.category] = [];
  }
  categories[p.category].push(p);
});

// -------------------------
// BUILD PRODUCT PAGE
// -------------------------
function buildProductPage(product) {
  const related = categories[product.category].filter(
    (p) => p.asin !== product.asin
  );

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${product.title} Review 2026</title>
  <meta name="description" content="Detailed review of ${product.title}, features, pros, and buying guide.">
</head>

<body>

<a href="index.html">🏠 Home</a>

<h1>${product.title}</h1>

<p>${product.description}</p>

<h2>Key Features</h2>
<ul>
  ${product.features.map((f) => `<li>${f}</li>`).join("")}
</ul>

<h2>Category: ${product.category}</h2>

<h2>Why People Buy This</h2>
<p>
This product is popular in the ${product.category} category because it offers a balance of price, performance, and usability.
</p>

<h2>Pros</h2>
<ul>
  <li>Affordable option</li>
  <li>Good performance</li>
  <li>Widely used in ${product.category}</li>
</ul>

<h2>Cons</h2>
<ul>
  <li>Not premium grade</li>
  <li>Limited advanced features</li>
</ul>

<h2>Related Products</h2>
<ul>
  ${related
    .map((p) => `<li><a href="${p.asin}.html">${p.title}</a></li>`)
    .join("")}
</ul>

<h2>Buy on Amazon</h2>
<a href="${product.affiliateUrl}" target="_blank">
👉 Check Price on Amazon
</a>

<footer>
  <p>ASIN: ${product.asin}</p>
</footer>

</body>
</html>
`;

  fs.writeFileSync(path.join(process.cwd(), `${product.asin}.html`), html);
  console.log("Generated product page:", product.asin);
}

// -------------------------
// BUILD CATEGORY PAGES
// -------------------------
function buildCategoryPages() {
  Object.keys(categories).forEach((cat) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${cat} Products</title>
</head>

<body>

<a href="index.html">🏠 Home</a>

<h1>${cat} Products</h1>

<ul>
  ${categories[cat]
    .map((p) => `<li><a href="${p.asin}.html">${p.title}</a></li>`)
    .join("")}
</ul>

</body>
</html>
`;

    fs.writeFileSync(
      path.join(process.cwd(), `${cat.toLowerCase()}.html`),
      html
    );

    console.log("Generated category page:", cat);
  });
}

// -------------------------
// BUILD HOMEPAGE
// -------------------------
function buildIndexPage() {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Amazon Product Review Hub</title>
  <meta name="description" content="Best Amazon product reviews and guides by category.">
</head>

<body>

<h1>Amazon Product Review Hub</h1>

<p>Browse top product categories below:</p>

<ul>
  ${Object.keys(categories)
    .map(
      (cat) =>
        `<li><a href="${cat.toLowerCase()}.html">${cat}</a></li>`
    )
    .join("")}
</ul>

</body>
</html>
`;

  fs.writeFileSync(path.join(process.cwd(), "index.html"), html);
  console.log("Generated homepage");
}

// -------------------------
// RUN BUILD PROCESS
// -------------------------
products.forEach(buildProductPage);
buildCategoryPages();
buildIndexPage();

console.log("✅ All pages generated successfully");
