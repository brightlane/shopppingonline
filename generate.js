const fs = require("fs");

// LOAD DATA
const products = JSON.parse(fs.readFileSync("./products-core.json", "utf-8"));

// TEMPLATE GENERATOR
function buildPage(product) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${product.name} | Best Deal 2026</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    body {font-family:Arial;background:#f6f8fc;margin:0;}
    .wrap {max-width:900px;margin:auto;padding:20px;}
    .card {background:white;padding:20px;border-radius:12px;margin-top:20px;}
    img {width:100%;border-radius:12px;}
    a {display:inline-block;margin-top:15px;padding:12px 16px;background:#f59e0b;color:black;text-decoration:none;border-radius:10px;font-weight:bold;}
  </style>
</head>

<body>

<div class="wrap">

  <h1>${product.name}</h1>

  <div class="card">
    <img src="${product.image}" />

    <p>Top rated product in ${product.category}. Best value for 2026 buyers.</p>

    <a href="https://www.amazon.com/dp/${product.asin}?tag=brightlane201-20" target="_blank" rel="nofollow sponsored">
      🛒 Buy on Amazon
    </a>

  </div>

</div>

</body>
</html>
`;
}

// OUTPUT FOLDER
if (!fs.existsSync("./dist")) {
  fs.mkdirSync("./dist");
}

// GENERATE FILES
products.forEach(p => {
  const html = buildPage(p);
  fs.writeFileSync(`./dist/${p.slug}.html`, html);
  console.log("Generated:", p.slug);
});

console.log("DONE: All product pages generated.");
