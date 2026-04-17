const AFFILIATE_TAG = "brightlane201-20";

/**
 * 🔥 SINGLE SOURCE OF TRUTH FOR AMAZON LINKS
 * Never hardcode links anywhere else again
 */
function getAmazonLink(asin) {

  if (!asin || typeof asin !== "string") {
    console.error("❌ Invalid ASIN:", asin);
    return "#";
  }

  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

/**
 * 🧠 VALIDATE LINK MATCHES ASIN (DEBUG TOOL)
 */
function validateProductLink(product) {
  const expected = getAmazonLink(product.asin);

  if (product.link && product.link !== expected) {
    console.warn("⚠️ Link mismatch detected:", product.title);
    console.warn("Expected:", expected);
    console.warn("Found:", product.link);
  }
}

module.exports = {
  getAmazonLink,
  validateProductLink
};
