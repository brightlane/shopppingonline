// ================================
// 🔒 AMAZON AFFILIATE CONFIG (LOCKED)
// ================================

window.AFFILIATE_TAG = "brightlane201-20";

/**
 * Validate ASIN (prevents broken / 404 Amazon links)
 */
function isValidASIN(asin) {
  return typeof asin === "string" && /^[A-Z0-9]{10}$/.test(asin);
}

/**
 * Safe Amazon link builder (NO MORE 404s)
 * - prevents undefined ASIN links
 * - prevents malformed URLs
 * - guarantees valid structure
 */
window.amazonLink = function (asin) {
  if (!isValidASIN(asin)) {
    console.warn("⚠️ Invalid ASIN blocked:", asin);
    return "https://www.amazon.com/?tag=" + window.AFFILIATE_TAG;
  }

  return `https://www.amazon.com/dp/${asin}?tag=${window.AFFILIATE_TAG}`;
};

// ================================
// 📊 CLICK TRACKING (SAFE)
// ================================
window.trackAffiliateClick = function (asin, productId = "") {
  try {
    console.log("Affiliate Click:", { asin, productId });

    // future: analytics hook (Google / Bing / custom)
    // fetch("/track", { method: "POST", body: JSON.stringify({ asin, productId }) });

  } catch (e) {
    console.warn("Tracking failed:", e);
  }
};

// ================================
// 🧠 GLOBAL SAFETY LAYER
// ================================
window.AFFILIATE_GUARD = {
  validateASIN: isValidASIN,
  version: "1.0.0"
};
