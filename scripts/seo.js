/**
 * seo.js
 * Autonomous SEO Page Generator (AAC Layer)
 * Turns ranked products into full HTML landing pages
 */

const fs = require("fs");
const path = require("path");
const { buildAffiliateUrl } = require("../core.orchestrator");

// === MAIN ENTRY ===
function generatePages(products = []) {
  const pages = [];

  products.forEach((product, index) => {
    const page = buildPage(product, index);
    pages.push(page);
  });

  return pages;
}

// === PAGE BUILDER ===
function buildPage(product, index) {
  const slug = createSlug(product.title || product.name || `product-${index}`);

  const amazonUrl = buildAffiliateUrl(
    product.asin,
    product.country || "us",
    product.tag
  );

  const image = product.image || "https://via.placeholder.com/600";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${product.title}</title>
<meta name="description" content="${product.description || ""}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #0b0f1a;
  color: white;
}

.container {
  max-width: 900px;
  margin: auto;
  padding: 30px;
}

.card {
  background: #121a2a;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #1f2a44;
}

img {
  width: 100%;
  border-radius: 12px;
}

a.button {
  display: inline-block;
  margin-top: 20px;
  padding: 14px 20px;
  background: #ff9900;
  color: black;
  font-weight: bold;
  text-decoration: none;
  border-radius: 10px;
}
</style>

</head>

<body>

<div class="container">
  <div class="card">

    <h1>${product.title}</h1>

    <img src="${image}" alt="${product.title}" />

    <p>${product.description || "Top rated product comparison and review."}</p>

    <h3>Why people buy this:</h3>
    <ul>
      ${(product.features || [])
        .map(f => `<li>${f}</li>`)
        .join("")}
    </ul>

    <a class="button" href="${amazonUrl}" target="_blank">
      View on Amazon
    </a>

  </div>
</div>

</body>
</html>
`;

  return {
    slug,
    html,
    product
  };
}

// === SLUG ENGINE ===
function createSlug(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// === EXPORTS ===
module.exports = {
  generatePages
};
