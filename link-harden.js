/**
 * =========================================
 * 🔒 FINAL AMAZON LINK HARDENING SYSTEM
 * =========================================
 * PURPOSE:
 * - Prevent ALL broken Amazon links (404s)
 * - Enforce valid ASIN-only routing
 * - Auto-repair legacy bad links
 * - Block unsafe product generation
 * =========================================
 */

import fs from "fs";
import { buildAmazonUrl, normalizeASIN } from "./product-link.js";

/* =========================
   STRICT ASIN VALIDATION
========================= */

function isValidASIN(asin) {
  return /^[A-Z0-9]{10}$/i.test(asin || "");
}

/* =========================
   HARD LINK BUILDER (FAIL SAFE)
========================= */

export function safeAmazonLink(asin) {
  const clean = normalizeASIN(asin);

  if (!clean || !isValidASIN(clean)) {
    return {
      ok: false,
      url: null,
      reason: "INVALID_ASIN"
    };
  }

  const url = buildAmazonUrl(clean);

  if (!url || url.includes("invalid")) {
    return {
      ok: false,
      url: null,
      reason: "BUILD_FAILED"
    };
  }

  return {
    ok: true,
    url
  };
}

/* =========================
   PRODUCT BLOCK VALIDATOR
========================= */

export function validateProduct(product) {
  const result = safeAmazonLink(product.asin);

  if (!result.ok) {
    return {
      valid: false,
      product,
      reason: result.reason
    };
  }

  return {
    valid: true,
    product: {
      ...product,
      asin: normalizeASIN(product.asin),
      amazonUrl: result.url
    }
  };
}

/* =========================
   BULK PIPELINE VALIDATOR
========================= */

export function validateProductList(products = []) {
  const valid = [];
  const rejected = [];

  for (const p of products) {
    const result = validateProduct(p);

    if (result.valid) {
      valid.push(result.product);
    } else {
      rejected.push(result);
      console.warn("❌ BLOCKED PRODUCT:", p.title, p.asin);
    }
  }

  return { valid, rejected };
}

/* =========================
   HTML LINK FIXER (LEGACY CLEANER)
========================= */

export function fixLegacyAmazonLinks(html) {
  return html
    // fix broken /gp/product links
    .replace(
      /https:\/\/www\.amazon\.com\/gp\/product\/([A-Z0-9]{5,15})/gi,
      (_, asin) => buildAmazonUrl(asin)
    )
    // fix dp links missing tags
    .replace(
      /https:\/\/www\.amazon\.com\/dp\/([A-Z0-9]{10})(?!\?tag=)/gi,
      (_, asin) => buildAmazonUrl(asin)
    );
}

/* =========================
   FILE SAFETY PIPELINE
========================= */

export function hardenFile(filePath) {
  let html = fs.readFileSync(filePath, "utf-8");

  const fixed = fixLegacyAmazonLinks(html);

  fs.writeFileSync(filePath, fixed);

  console.log("🔒 LINK HARDENED:", filePath);
}

/* =========================
   BUILD GATE (BLOCK BAD DATA)
========================= */

export function buildGate(products) {
  const { valid, rejected } = validateProductList(products);

  if (rejected.length > 0) {
    console.log("🚨 BUILD WARNING:");
    console.log(`Rejected products: ${rejected.length}`);
  }

  return valid;
}
