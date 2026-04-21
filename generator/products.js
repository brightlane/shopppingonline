const fs = require("fs");
const products = require("./products");

function buildPage(p) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${p.title} Review</title>
  <meta name="description" content="Honest review of ${p.title}">
</head>

<body>

<h1>${p.title}</h1>

<p>
This page reviews the Amazon product and breaks down features, pros, and use cases.
</p>

<h2>Key Features</h2>
<ul>
  ${p.features.map(f => `<li>${f}</li>`).join("")}
</ul>

<h2>Why People Buy This</h2>
<p>
Users choose this product because it solves key problems in the ${p.niche} category.
</p>

<h2>Buy Now</h2>
<a href="${p.affiliateUrl}" target="_blank">View on Amazon</a>

</body>
</html>
`;

  fs.writeFileSync(`${p.id}.html`, html);
  console.log("Generated:", p.id);
}

products.forEach(buildPage);
