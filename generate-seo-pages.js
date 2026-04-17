const fs = require("fs");

// LOAD KEYWORDS
const keywords = JSON.parse(fs.readFileSync("./seo-keywords.json", "utf-8"));

function slugify(text) {
  return text.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9\-]/g, "");
}

function buildPage(category, keyword) {

  const title = keyword.charAt(0).toUpperCase() + keyword.slice(1);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title} | Best 2026 Guide</title>
  <meta name="description" content="${title} - Top products and buying guide for 2026">

  <style>
    body {font-family:Arial;background:#f7f7fb;margin:0;}
    header {background:#111827;color:white;padding:40px;text-align:center;}
    .container {max-width:900px;margin:auto;padding:20px;}
    .card {background:white;padding:20px;margin-top:20px;border-radius:12px;}
    a {color:#2563eb;text-decoration:none;}
  </style>
</head>

<body>

<header>
  <h1>${title}</h1>
  <p>Best products, reviews and comparisons</p>
</header>

<div class="container">

  <div class="card">
    <h2>🔥 Top Picks</h2>
    <p>We analyzed the best products for: <b>${keyword}</b></p>

    <a href="${category}-hub.html">← Back to ${category} hub</a>
  </div>

  <div class="card">
    <h2>🛒 Recommended Products</h2>
    <p>Check curated Amazon picks for this category.</p>

    <a href="best-${category}-en.html">View Best Products</a>
  </div>

</div>

</body>
</html>
`;
}

// OUTPUT FOLDER
if (!fs.existsSync("./seo-pages")) {
  fs.mkdirSync("./seo-pages");
}

// GENERATE PAGES
Object.keys(keywords).forEach(category => {
  keywords[category].forEach(keyword => {

    const slug = slugify(keyword) + ".html";
    const html = buildPage(category, keyword);

    fs.writeFileSync(`./seo-pages/${slug}`, html);

    console.log("Generated:", slug);
  });
});

console.log("SEO EXPANSION COMPLETE");
