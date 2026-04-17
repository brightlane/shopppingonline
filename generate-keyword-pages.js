const fs = require("fs");

// Load keyword clusters
const data = JSON.parse(fs.readFileSync("./seo-keywords.json", "utf-8"));

// Create folder if needed
if (!fs.existsSync("./keyword-pages")) {
  fs.mkdirSync("./keyword-pages");
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function buildPage(category, keyword) {

  const title = keyword.charAt(0).toUpperCase() + keyword.slice(1);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title} | Best Guide 2026</title>

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${title} - best products, guides and recommendations">

  <style>
    body {font-family:Arial;background:#f6f7fb;margin:0;}
    header {background:#111827;color:white;padding:40px;text-align:center;}
    .container {max-width:900px;margin:auto;padding:20px;}
    .card {background:white;padding:20px;margin-top:20px;border-radius:12px;}
    a {color:#2563eb;text-decoration:none;font-weight:bold;}
  </style>
</head>

<body>

<header>
  <h1>${title}</h1>
  <p>Best products for this specific need</p>
</header>

<div class="container">

  <div class="card">
    <h2>🔥 Why this matters</h2>
    <p>This page targets a very specific buying intent: <b>${keyword}</b></p>
  </div>

  <div class="card">
    <h2>🛒 Recommended Products</h2>
    <p>We selected top Amazon products for this use case.</p>

    <a href="../${category}-hub.html">← Back to ${category} hub</a>
  </div>

  <div class="card">
    <h2>📌 Next Step</h2>
    <p>Compare options or view best sellers in this category.</p>

    <a href="../best-${category}-en.html">View Best Products</a>
  </div>

</div>

</body>
</html>
`;
}

// GENERATE PAGES
Object.keys(data).forEach(category => {
  data[category].forEach(keyword => {

    const slug = slugify(keyword) + ".html";

    const html = buildPage(category, keyword);

    fs.writeFileSync(`./keyword-pages/${slug}`, html);

    console.log("Generated:", slug);
  });
});

console.log("Keyword pages generated successfully.");
