// config.js

const AFFILIATE_TAG = "brightside20-20";

function amazonLink(urlOrAsin) {
  if (!urlOrAsin) return "#";

  // If it's already a full URL
  if (urlOrAsin.includes("amazon.com")) {
    return urlOrAsin.includes("?")
      ? urlOrAsin + "&tag=" + AFFILIATE_TAG
      : urlOrAsin + "?tag=" + AFFILIATE_TAG;
  }

  // If it's just an ASIN
  return `https://www.amazon.com/dp/${urlOrAsin}?tag=${AFFILIATE_TAG}`;
}
