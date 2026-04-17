const AFFILIATE_TAG = "brightlane201-20";

function amazonLink(asin) {

  if (!asin || typeof asin !== "string") {
    return "#";
  }

  // HARD CLEAN: strip anything that is NOT ASIN
  asin = asin.replace(/[^A-Z0-9]/gi, "").toUpperCase();

  // VALIDATE LENGTH (Amazon ASIN is usually 10 chars)
  if (asin.length < 8 || asin.length > 12) {
    return "#";
  }

  // BUILD EXACTLY ONE CLEAN URL
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

module.exports = { amazonLink };
