const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "../dist");

function buildSEO(products) {
  const html = `
<!DOCTYPE html>
<html>
<head>
<title>Best Affiliate Products 2026</title>
</head>
<body>

<h1>Top Products</h1>

${products.map(p => `
  <a href="/products/${p.asin}.html">
    ${p.title}
  </a><br>
`).join("")}

</body>
</html>
`;

  fs.writeFileSync(path.join(DIST, "index.html"), html);
}

module.exports = { buildSEO };
