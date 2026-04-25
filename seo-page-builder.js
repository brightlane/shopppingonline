const fs = require("fs");
const path = require("path");
const {
  generateSEOPage
} = require("./seo-global-engine");

const OUTPUT_DIR = path.join(__dirname, "dist");

// -----------------------------
// SAFE WRITE
// -----------------------------
function writeFile(filePath, content) {
  const fullPath = path.join(OUTPUT_DIR, filePath);

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf-8");
}

// -----------------------------
// BASIC HTML TEMPLATE
// -----------------------------
function buildHTML({ keyword, meta, affiliateLink, crossLinks, lang }) {
  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <title>${meta.title}</title>

  <meta name="description" content="${meta.description}" />
  <meta name="keywords" content="${meta.keywords}" />

  <meta property="og:title" content="${meta.ogTitle}" />
  <meta property="og:description" content="${meta.ogDescription}" />

  <link rel="canonical" href="https://yourdomain.com/${keyword}/${lang}/" />

  <!-- hreflang -->
  ${generateHreflangTags(keyword)}
</head>

<body>

  <h1>${keyword}</h1>

  <p>Best deals and reviews for ${keyword} in ${lang.toUpperCase()}.</p>

  <a href="${affiliateLink}" target="_blank">
    Buy on Amazon
  </a>

  <h2>Related Pages</h2>
  <ul>
    ${crossLinks.map(link => `<li><a href="${link}">${link}</a></li>`).join("\n")}
  </ul>

</body>
</html>
`;
}

// -----------------------------
// HREFLANG GENERATOR
// -----------------------------
function generateHreflangTags(keyword) {
  const langs = ["en", "de", "es", "fr", "it"];

  return langs.map(lang => {
    return `<link rel="alternate" hreflang="${lang}" href="https://yourdomain.com/${keyword}/${lang}/" />`;
  }).join("\n");
}

// -----------------------------
// PAGE GENERATION ENGINE
// -----------------------------
function buildPages(keywords) {
  keywords.forEach((item) => {
    const data = generateSEOPage({
      keyword: item.keyword,
      asin: item.asin || "B000000000",
      country: item.country || "us"
    });

    const slug = data.slug;

    ["en", "de", "es", "fr", "it"].forEach((lang) => {
      const html = buildHTML({
        keyword: data.keyword,
        meta: data.meta,
        affiliateLink: data.affiliateLink,
        crossLinks: data.crossLinks,
        lang
      });

      writeFile(`${slug}/${lang}/index.html`, html);
    });
  });
}

// -----------------------------
// RUNNER
// -----------------------------
function run() {
  const keywords = require("./keywords.json").keywords.map(k => ({
    keyword: k,
    asin: "B08EXAMPLE"
  }));

  console.log("🚀 Building SEO pages...");

  buildPages(keywords);

  console.log("✅ Build complete");
}

run();
