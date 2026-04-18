/**
 * auto-product-feed.js
 * AAC Product Data Brain
 * Loads, normalizes, and prepares product universe (Top 100 → 1000 scaling ready)
 */

const fs = require("fs");
const path = require("path");

// === LOAD PRODUCT DATABASE ===
function loadProducts() {
  const dataPath = path.join(__dirname, "../products-core.json");

  if (!fs.existsSync(dataPath)) {
    console.error("❌ products-core.json not found");
    return [];
  }

  const raw = fs.readFileSync(dataPath, "utf8");

  try {
    const products = JSON.parse(raw);
    return normalize(products);
  } catch (err) {
    console.error("❌ Product JSON parse error:", err.message);
    return [];
  }
}

// === NORMALIZE PRODUCT STRUCTURE ===
function normalize(products = []) {
  return products.map((p, index) => {
    return {
      id: p.id || index,
      asin: p.asin || null,
      title: p.title || "Untitled Product",
      description: p.description || "",
      category: p.category || "general",
      price: p.price || null,
      country: p.country || "us",

      // SEO / ranking signals
      features: p.features || [],
      tags: p.tags || [],
      score: p.score || 1,

      // media
      image: p.image || null,

      // affiliate safe defaults
      tag: p.tag || "brightlane201-20"
    };
  });
}

// === TOP 1000 EXPANSION ENGINE (SCAFFOLD) ===
function expandProductUniverse(products = []) {
  const expanded = [];

  products.forEach(p => {
    expanded.push(p);

    // auto-generate variants (future scaling hook)
    const variants = generateVariants(p);
    expanded.push(...variants);
  });

  return expanded;
}

// === VARIANT GENERATOR (SEO CLUSTER SEEDING) ===
function generateVariants(product) {
  const variants = [];

  const base = product.title;

  variants.push({
    ...product,
    title: `${base} Review`,
    score: product.score * 1.1
  });

  variants.push({
    ...product,
    title: `${base} vs Competitors`,
    score: product.score * 1.2
  });

  variants.push({
    ...product,
    title: `Best ${base} 2026`,
    score: product.score * 1.3
  });

  return variants;
}

// === EXPORTS ===
module.exports = {
  loadProducts,
  normalize,
  expandProductUniverse,
  generateVariants
};
