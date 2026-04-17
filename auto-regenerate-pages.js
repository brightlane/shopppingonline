const fs = require("fs");
const path = require("path");

const DATA = path.join(__dirname, "products-clean.json");
const OUTPUT = path.join(__dirname, "dist");

function load() {
  return JSON.parse(fs.readFileSync(DATA, "utf-8"));
}

function buildPage(p) {
  return `<!DOCTYPE html>
<html>
<head>
<title>${p.title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

<h1>${p.title}</h1>

<img src="${p.image}" style="max-width:100%;border-radius:10px;" />

<p>Best price available on Amazon.</p>

<a href="${p.affiliate}" target="_blank" rel="nofollow sponsored">
Buy on Amazon
</a>

</body>
</html>`;
}

function run() {
  if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT);

  const products = load();

  products.forEach(p => {
    const file = path.join(OUTPUT, `${p.asin}.html`);
    fs.writeFileSync(file, buildPage(p));
  });

  console.log("🏗️ Pages regenerated:", products.length);
}

run();
