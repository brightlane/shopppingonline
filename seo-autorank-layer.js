const fs = require("fs");
const path = require("path");

/**
 * 🔥 OUTPUT DIR (your /dist site)
 */
const OUTPUT_DIR = path.join(__dirname, "dist");

/**
 * 🧠 SITE CONFIG
 */
const SITE_URL = "https://brightlane.github.io/shopppingonline";

/**
 * 📦 LOAD BUILT PRODUCTS (from SSRE output or source)
 */
function getFiles() {
  return fs.readdirSync(OUTPUT_DIR);
}

/**
 * 🧠 META TITLE GENERATOR
 */
function makeTitle(product) {
  return `${product.title} – Best Price & Review`;
}

/**
 * 🧠 META DESCRIPTION GENERATOR
 */
function makeDescription(product) {
  return `Buy ${product.title} at best price. Read review, compare features and get it on Amazon fast.`;
}

/**
 * 🔥 JSON-LD SCHEMA (GOOGLE RICH RESULTS)
 */
function buildSchema(product) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.image,
    "description": makeDescription(product),
    "brand": {
      "@type": "Brand",
      "name": "Amazon"
    },
    "offers": {
      "@type": "Offer",
      "url": `${SITE_URL}/${product.asin}.html`,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };
}

/**
 * 🧱 INJECT SEO INTO HTML PAGE
 */
function injectSEO(filePath, product) {
  let html = fs.readFileSync(filePath, "utf-8");

  const title = makeTitle(product);
  const desc = makeDescription(product);
  const schema = JSON.stringify(buildSchema(product));

  const seoBlock = `
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${SITE_URL}/${product.asin}.html">

<script type="application/ld+json">
${schema}
</script>
`;

  html = html.replace("</head>", `${seoBlock}</head>`);

  fs.writeFileSync(filePath, html, "utf-8");
}

/**
 * 📦 LOAD PRODUCT DATA FROM BUILT PAGES
 */
function extractProductFromFile(file) {
  const name = file.replace(".html", "");

  if (!/^[A-Z0-9]{10}$/.test(name)) return null;

  return {
    asin: name,
    title: name.replace(/-/g, " "),
    image: "https://via.placeholder.com/600x400"
  };
}

/**
 * 🚀 MAIN RUNNER
 */
function run() {
  const files = getFiles();

  let sitemap = [];

  files.forEach(file => {
    const filePath = path.join(OUTPUT_DIR, file);

    if (!file.endsWith(".html")) return;

    const product = extractProductFromFile(file);

    if (!product) return;

    injectSEO(filePath, product);

    sitemap.push(`${SITE_URL}/${file}`);
  });

  /**
   * 🗺️ SITEMAP GENERATION
   */
  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map(url => `<url><loc>${url}</loc></url>`).join("\n")}
</urlset>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, "sitemap.xml"), sitemapXML);

  /**
   * 🤖 ROBOTS.TXT
   */
  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml`;

  fs.writeFileSync(path.join(OUTPUT_DIR, "robots.txt"), robots);

  console.log("🚀 SEO AUTORANK LAYER COMPLETE");
}

run();
