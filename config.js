window.AFFILIATE_TAG = "brightlane201-20";

/**
 * SAFE AMAZON LINK BUILDER
 * - prevents broken URLs
 * - validates ASIN
 * - always returns working product page
 */
window.amazonLink = function (asin) {

  if (!asin) return "#";

  // clean ASIN (Amazon ASIN = 10 chars usually)
  asin = String(asin).trim();

  // fix broken inputs like full URLs or junk
  if (asin.includes("amazon")) {
    const match = asin.match(/\/dp\/([A-Z0-9]{10})/i);
    if (match) asin = match[1];
  }

  // validate ASIN format (safe fallback)
  const valid = /^[A-Z0-9]{10}$/i.test(asin);

  if (!valid) {
    console.warn("Invalid ASIN:", asin);
    return "#";
  }

  // ALWAYS return correct affiliate link
  return `https://www.amazon.com/dp/${asin}?tag=${window.AFFILIATE_TAG}`;
};
