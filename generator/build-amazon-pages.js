const fs = require("fs");
const products = require("./amazon-products");

function longReview(product) {
  return `
This ${product.title} is one of the most discussed products in the ${product.category} category.

It is commonly searched under keywords like:
${product.keywords.map(k => `- ${k}`).join("\n")}

## Overview
${product.description}

## Why people buy it
Users choose this product because it offers a balance between performance, price, and reliability.

## Key Features
${product.features.map(f => `- ${f}`).join("\n")}

## Pros
- Good value for money
- Reliable build quality
- Popular in its category

## Cons
- May not be premium level
- Limited advanced features

## Final Verdict
If you are searching for a ${product.category.toLowerCase()} solution, this product is worth considering for beginners and intermediate users.
`;
}

function build(product) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${product.title} Review 2026</title>
  <meta name="description" content="${product.title} review, features, pros and buying guide">
</head>

<body>

<a href="index.html">Home</a>

<h1>${product.title} Review</h1>

<pre>${longReview(product)}</pre>

<h2>Buy Now</h2>
<a href="${product.affiliateUrl}" target="_blank">
Check Price on Amazon
</a>

<h3>Related Searches</h3>
<ul>
${product.keywords.map(k => `<li>${k}</li>`).join("")}
</ul>

</body>
</html>
`;

  fs.writeFileSync(`${product.asin}.html`, html);
  console.log("SEO page built:", product.asin);
}

products.forEach(build);
