window.AFFILIATE_TAG = "brightlane201-20";

/**
 * SAFE AMAZON LINK BUILDER (NO 404s)
 * - validates ASIN
 * - forces correct /dp/ format
 * - prevents broken links
 */
window.amazonLink = function (asin) {
  if (!asin || typeof asin !== "string") return "#";

  const cleanAsin = asin.trim().toUpperCase();

  // ASIN validation (prevents garbage links)
  const isValidASIN = /^[A-Z0-9]{10}$/.test(cleanAsin);
  if (!isValidASIN) {
    console.warn("Invalid ASIN blocked:", asin);
    return "#";
  }

  return `https://www.amazon.com/dp/${cleanAsin}?tag=${window.AFFILIATE_TAG}`;
};
