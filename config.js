window.AFFILIATE_TAG = "brightlane201-20";

/**
 * SAFE Amazon URL builder
 * prevents broken links + missing ASIN issues
 */
window.amazonLink = function (asin) {
  if (!asin || asin.length < 5) {
    console.error("Invalid ASIN:", asin);
    return "#";
  }

  return `https://www.amazon.com/dp/${asin}?tag=${window.AFFILIATE_TAG}`;
};

/**
 * Track clicks safely (no breaking navigation)
 */
window.trackClick = function (asin, productId) {
  console.log("Click tracked:", productId, asin);
};
