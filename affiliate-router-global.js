const url = require("url");

// -----------------------------
// AMAZON REGIONAL CONFIG
// -----------------------------
const AMAZON = {
  us: { domain: "amazon.com", tag: "yourtag-20" },
  de: { domain: "amazon.de", tag: "yourtag-21" },
  uk: { domain: "amazon.co.uk", tag: "yourtag-22" },
  fr: { domain: "amazon.fr", tag: "yourtag-23" },
  it: { domain: "amazon.it", tag: "yourtag-24" },
  es: { domain: "amazon.es", tag: "yourtag-25" },
  ca: { domain: "amazon.ca", tag: "yourtag-26" },
  jp: { domain: "amazon.co.jp", tag: "yourtag-27" }
};

// -----------------------------
// BASIC COUNTRY DETECTION (SERVER / HEADER BASED)
// -----------------------------
function detectCountry(req = {}) {
  const acceptLang = (req.headers?.["accept-language"] || "").toLowerCase();

  if (acceptLang.includes("de")) return "de";
  if (acceptLang.includes("fr")) return "fr";
  if (acceptLang.includes("es")) return "es";
  if (acceptLang.includes("it")) return "it";
  if (acceptLang.includes("en-gb")) return "uk";

  return "us";
}

// -----------------------------
// VALIDATE ASIN
// -----------------------------
function isValidASIN(asin) {
  return /^[A-Z0-9]{10}$/.test(asin);
}

// -----------------------------
// BUILD AMAZON LINK
// -----------------------------
function buildAmazonLink({ asin, country }) {
  if (!asin || !isValidASIN(asin)) {
    return null;
  }

  const region = AMAZON[country] || AMAZON.us;

  return `https://${region.domain}/dp/${asin}?tag=${region.tag}`;
}

// -----------------------------
// CLICK TRACKING WRAPPER
// -----------------------------
function wrapAffiliateLink({ asin, country, keyword }) {
  const baseLink = buildAmazonLink({ asin, country });

  if (!baseLink) return "#invalid-asin";

  const trackingPayload = encodeURIComponent(
    JSON.stringify({
      asin,
      country,
      keyword,
      ts: Date.now()
    })
  );

  return `/redirect?url=${encodeURIComponent(baseLink)}&data=${trackingPayload}`;
}

// -----------------------------
// GLOBAL ROUTER (MAIN ENTRY)
// -----------------------------
function getAffiliateLink({ asin, keyword, req }) {
  const country = detectCountry(req);

  return wrapAffiliateLink({
    asin,
    country,
    keyword
  });
}

// -----------------------------
// OPTIONAL: LOGGING (for scaling optimization)
// -----------------------------
function logClick(data) {
  console.log("CLICK_EVENT:", {
    ...data,
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  detectCountry,
  buildAmazonLink,
  wrapAffiliateLink,
  getAffiliateLink,
  logClick
};
