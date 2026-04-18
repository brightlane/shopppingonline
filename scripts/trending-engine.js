/**
 * trending-engine.js
 * AAC Ranking + CTR Optimization Layer
 * Self-healing product scoring system
 */

const fs = require("fs");
const path = require("path");

// === MAIN ENTRY ===
function rank(products = [], keywords = []) {
  const scored = products.map(p => {
    return {
      ...p,
      score: calculateScore(p, keywords)
    };
  });

  // sort highest value first
  return scored.sort((a, b) => b.score - a.score);
}

// === CORE SCORING ENGINE ===
function calculateScore(product, keywords = []) {
  let score = 1;

  // base quality signals
  if (product.title) score += 1;
  if (product.image) score += 1;
  if (product.asin) score += 2;

  // category boost (high intent niches)
  const hotCategories = [
    "vacuum",
    "coffee",
    "electronics",
    "fitness",
    "smart home",
    "kitchen"
  ];

  if (hotCategories.includes(product.category)) {
    score += 3;
  }

  // keyword match scoring
  keywords.forEach(k => {
    if (product.title?.toLowerCase().includes(k.toLowerCase())) {
      score += 2;
    }
    if (product.description?.toLowerCase().includes(k.toLowerCase())) {
      score += 1;
    }
  });

  // price signal (basic CTR logic simulation)
  if (product.price) {
    if (product.price < 50) score += 1;
    if (product.price > 200) score += 2;
  }

  // tag strength (affiliate optimization)
  if (product.tag === "brightlane201-20") {
    score += 1;
  }

  // random exploration factor (prevents stagnation)
  score += Math.random() * 0.5;

  return score;
}

// === CTR HEALING LOOP (SIMULATED FEEDBACK SYSTEM) ===
function applyFeedback(products, feedbackData = {}) {
  return products.map(p => {
    const clicks = feedbackData[p.asin]?.clicks || 0;
    const conversions = feedbackData[p.asin]?.conversions || 0;

    let boost = 0;

    if (clicks > 100) boost += 1;
    if (clicks > 500) boost += 2;
    if (conversions > 10) boost += 3;

    return {
      ...p,
      score: (p.score || 1) + boost
    };
  });
}

// === TREND DETECTION (BASIC SIGNAL ENGINE) ===
function detectTrends(products = []) {
  const trendMap = {};

  products.forEach(p => {
    const words = (p.title || "").toLowerCase().split(" ");

    words.forEach(w => {
      if (!trendMap[w]) trendMap[w] = 0;
      trendMap[w]++;
    });
  });

  return Object.entries(trendMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

// === EXPORTS ===
module.exports = {
  rank,
  calculateScore,
  applyFeedback,
  detectTrends
};
