const SITE_CONFIG = {
  siteName: "Best Products 2026",
  baseUrl: "https://brightlane.github.io/shopppingonline",

  googleVerification: "eWVDN3vbam9nnaZQu7wAQKyfmJJdM7zjI80l4DGeUrQ",
  bingVerification: "574044E39556B8B8DAAF1D1F233C87B0"
};

// ===============================
// 🔒 IMMUTABLE HEAD SYSTEM
// ===============================
function buildHead(title, description) {
  return `
<head>
  <meta charset="UTF-8">

  <title>${title}</title>
  <meta name="description" content="${description}">

  <!-- 🔒 VERIFIED LOCK (DO NOT OVERWRITE) -->
  <meta name="google-site-verification" content="${SITE_CONFIG.googleVerification}">
  <meta name="msvalidate.01" content="${SITE_CONFIG.bingVerification}">

  <!-- CORE SEO -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="canonical" href="${SITE_CONFIG.baseUrl}">

  <!-- OPEN GRAPH -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">

  <!-- BASIC INDEX CONTROL -->
  <meta name="robots" content="index, follow">
</head>`;
}

module.exports = {
  SITE_CONFIG,
  buildHead
};
