// ==============================
// 🔥 AMAZON LINK BUILDER (SAFE + 404 PROTECTED)
// ==============================

const AFFILIATE_TAG = "brightlane201-20";

/**
 * Validates Amazon ASIN (10 char alphanumeric)
 */
function isValidAsin(asin) {
  return typeof asin === "string" && /^[A-Z0-9]{10}$/.test(asin);
}

/**
 * Clean Amazon ASIN (removes bad data)
 */
function sanitizeAsin(asin) {
  if (!asin) return null;
  const cleaned = String(asin).trim().toUpperCase();
  return isValidAsin(cleaned) ? cleaned : null;
}

/**
 * 🔥 MAIN AMAZON LINK BUILDER (USE THIS ONLY)
 * Prevents 404s automatically
 */
function amazonUrl(asin) {
  const clean = sanitizeAsin(asin);

  if (!clean) {
    console.warn("⚠️ Invalid ASIN blocked:", asin);
    return "#invalid-product";
  }

  return `https://www.amazon.com/dp/${clean}?tag=${AFFILIATE_TAG}`;
}

/**
 * Optional: tracking wrapper (future CTR analytics)
 */
function trackedAmazonUrl(asin, productTitle = "") {
  const url = amazonUrl(asin);

  return {
    url,
    onclick: `console.log('click', ${JSON.stringify(productTitle)})`
  };
}

module.exports = {
  amazonUrl,
  sanitizeAsin,
  isValidAsin,
  trackedAmazonUrl,
  AFFILIATE_TAG
};
