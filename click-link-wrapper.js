const AFFILIATE_TAG = "brightlane201-20";

/**
 * 🔥 CLICK TRACKING ENDPOINT
 * (your Express server)
 */
const CLICK_API = "https://YOUR-BACKEND-URL/click";

/**
 * 🔗 AMAZON LINK WITH CLICK TRACKING WRAPPER
 */
function amazonLink(asin) {

  if (!asin) return "#";

  const amazonURL = `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;

  return `/redirect.html?asin=${asin}&url=${encodeURIComponent(amazonURL)}`;
}

module.exports = {
  amazonLink
};
