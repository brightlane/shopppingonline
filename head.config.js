module.exports = {
  siteName: "Best Products 2026",

  googleVerification: "eWVDN3vbam9nnaZQu7wAQKyfmJJdM7zjI80l4DGeUrQ",
  bingVerification: "574044E39556B8B8DAAF1D1F233C87B0",

  canonicalBase: "https://brightlane.github.io/shopppingonline",

  getHead(title, description) {
    return `
<head>
  <meta charset="UTF-8">

  <title>${title}</title>
  <meta name="description" content="${description}">

  <!-- 🔒 NEVER REMOVE: SITE VERIFICATION LOCK -->
  <meta name="google-site-verification" content="${this.googleVerification}" />
  <meta name="msvalidate.01" content="${this.bingVerification}" />

  <!-- SEO CORE -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="canonical" href="${this.canonicalBase}">

  <!-- Open Graph -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
</head>`;
  }
};
