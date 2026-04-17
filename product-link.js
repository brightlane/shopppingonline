/**
 * =========================================
 * 🔗 AMAZON PRODUCT LINK ENGINE (FIXED)
 * =========================================
 * Fixes:
 * - broken Amazon URLs (404 issues)
 * - invalid ASINs
 * - duplicate products
 * - inconsistent link formats
 * - tracking consistency
 * =========================================
 */

import { AFFILIATE_TAG } from "./config.js";

/* =========================
   ASIN VALIDATION
========================= */

export function normalizeASIN(input) {
  if (!input) return null;

  const match = input.toString().match(/[A-Z0-9]{10}/i);
  return match ? match[0].toUpperCase() : null;
}

/* =========================
   AMAZON LINK BUILDER (SAFE)
========================= */

export function buildAmazonUrl(asin) {
  const clean = normalizeASIN(asin);

  if (!clean) {
    console.warn("❌ Invalid ASIN blocked:", asin);
    return null;
  }

  return `https://www.amazon.com/dp/${clean}?tag=${AFFILIATE_TAG}`;
}

/* =========================
   PRODUCT CLEANER (NO DUPES)
========================= */

export function cleanProducts(products = []) {
  const seen = new Map();

  return products
    .map(p => {
      const asin = normalizeASIN(p.asin);

      if (!asin) return null;

      return {
        ...p,
        asin
      };
    })
    .filter(Boolean)
    .filter(p => {
      if (seen.has(p.asin)) return false;
      seen.set(p.asin, true);
      return true;
    });
}

/* =========================
   CLICK TRACKING WRAPPER
========================= */

export function trackableLink(product, position = 0) {
  const url = buildAmazonUrl(product.asin);

  if (!url) return "#invalid";

  return {
    url,
    onclick: `
      if(window.gtag){
        gtag('event','click',{
          event_category:'affiliate',
          event_label:'${product.asin}',
          value:${position}
        });
      }
    `
  };
}

/* =========================
   PRODUCT NORMALIZER (AI SAFE)
========================= */

export function normalizeProduct(p) {
  return {
    title: p.title || "Untitled Product",
    asin: normalizeASIN(p.asin),
    image: p.image || "",
    price: p.price || null,
    rating: p.rating || "4.5",
    reviews: p.reviews || "1000+",
    category: p.category || "general",
    description: p.description || "Top-rated Amazon product"
  };
}

/* =========================
   BULK SAFE PROCESSOR
========================= */

export function processProductList(products) {
  const cleaned = cleanProducts(products);

  return cleaned.map(normalizeProduct);
}
