// config.js

// Your Amazon Associates ID
const AFFILIATE_TAG = "brightside20-20";

/**
 * Build a safe Amazon product link
 * Always attaches your affiliate tag correctly
 */
function amazonLink(asin) {
  if (!asin) return "#";

  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}
