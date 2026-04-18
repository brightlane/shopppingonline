/**
 * global-expansion-engine.js
 * AAC Global Product Universe Generator
 * Builds Top 100 → 1000+ product taxonomy automatically
 */

const fs = require("fs");
const path = require("path");

// === CORE CATEGORY SYSTEM ===
const CATEGORY_SEEDS = [
  "vacuum cleaners",
  "coffee makers",
  "smart home",
  "fitness gear",
  "kitchen appliances",
  "portable power",
  "electronics",
  "lighting",
  "travel gear",
  "home security"
];

// === ENTRY POINT ===
function buildGlobalUniverse(baseProducts = []) {
  const expanded = [];

  // 1. normalize base products
  baseProducts.forEach(p => expanded.push(p));

  // 2. expand into category clusters
  CATEGORY_SEEDS.forEach(seed => {
    const cluster = generateCluster(seed);
    expanded.push(...cluster);
  });

  // 3. auto scale variants
  const finalSet = generateMassVariants(expanded);

  return finalSet;
}

// === CATEGORY CLUSTER GENERATOR ===
function generateCluster(category) {
  const cluster = [];

  for (let i = 1; i <= 10; i++) {
    cluster.push({
      id: `${category}-${i}`,
      asin: null,
      title: `Best ${category} ${2026} Model ${i}`,
      description: `Top rated ${category} comparison and buying guide.`,
      category,
      country: "us",
      features: [
        "High performance",
        "Best value option",
        "Top rated in category"
      ],
      score: 2 + Math.random()
    });
  }

  return cluster;
}

// === MASS VARIANT EXPANSION (TOP 1000 ENGINE CORE) ===
function generateMassVariants(products = []) {
  const output = [];

  products.forEach(p => {
    output.push(p);

    // SEO intent variants
    output.push({
      ...p,
      title: `Best ${p.category} Review 2026`,
      score: p.score + 0.5
    });

    output.push({
      ...p,
      title: `${p.category} vs Competitors`,
      score: p.score + 0.7
    });

    output.push({
      ...p,
      title: `Top 10 ${p.category} Picks`,
      score: p.score + 1.0
    });

    // buyer intent variant
    output.push({
      ...p,
      title: `Cheap ${p.category} Deals`,
      score: p.score + 0.3
    });
  });

  return output;
}

// === SEO CLUSTER SORTING ===
function prioritizeUniverse(products = []) {
  return products.sort((a, b) => (b.score || 0) - (a.score || 0));
}

// === EXPORTS ===
module.exports = {
  buildGlobalUniverse,
  generateCluster,
  generateMassVariants,
  prioritizeUniverse
};
