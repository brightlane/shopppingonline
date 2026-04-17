window.AFFILIATE_TAG = "brightlane201-20";

/**
 * SAFE AMAZON LINK BUILDER
 * - never breaks pages
 * - always keeps affiliate tag
 * - prevents 404 / undefined ASIN issues
 */
window.amazonLink = function (asin) {
  if (!asin || typeof asin !== "string") {
    console.warn("Missing or invalid ASIN:", asin);

    // safe fallback (still tracks affiliate)
    return `https://www.amazon.com/?tag=${window.AFFILIATE_TAG}`;
  }

  return `https://www.amazon.com/dp/${asin}?tag=${window.AFFILIATE_TAG}`;
};
