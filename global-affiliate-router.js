/**
 * global-affiliate-router.js
 * BrightLane Affiliate Routing Brain (Global Layer)
 */

const AFFILIATE_TAG = "brightlane201-20";

// 🌍 Amazon marketplaces
const AMAZON_MARKETS = {
  US: "amazon.com",
  DE: "amazon.de",
  UK: "amazon.co.uk",
  FR: "amazon.fr",
  ES: "amazon.es",
  IT: "amazon.it",
  CA: "amazon.ca",
  JP: "amazon.co.jp",
  AU: "amazon.com.au",
  IN: "amazon.in"
};

// ============================
// 🌐 COUNTRY DETECTION (basic)
// ============================
function detectCountry(req = {}) {
  // later upgrade: IP geo detection (Cloudflare / MaxMind)
  return (
    req.country ||
    process.env.DEFAULT_COUNTRY ||
    "US"
  ).toUpperCase();
}

// ============================
// 🧠 MARKET RESOLVER
// ============================
function resolveMarketplace(country) {
  return AMAZON_MARKETS[country] || AMAZON_MARKETS.US;
}

// ============================
// 🔗 BUILD AFFILIATE LINK
// ============================
function buildAmazonLink({ asin, country = "US", path = "dp" }) {
  if (!asin) return null;

  const domain = resolveMarketplace(country);

  return `https://www.${domain}/${path}/${asin}?tag=${AFFILIATE_TAG}`;
}

// ============================
// 📦 NORMALIZE PRODUCT OBJECT
// ============================
function normalizeProduct(product, req = {}) {
  const country = detectCountry(req);

  return {
    ...product,
    country,
    affiliate_url: buildAmazonLink({
      asin: product.asin,
      country
    })
  };
}

// ============================
// 🔁 BATCH PROCESSOR (for 1000 products)
// ============================
function batchNormalize(products = [], req = {}) {
  return products.map(p => normalizeProduct(p, req));
}

// ============================
// 🎯 SMART ROUTER (future CTR layer hook)
// ============================
function smartRoute(product, req = {}) {
  const enriched = normalizeProduct(product, req);

  // placeholder for future:
  // - A/B testing links
  // - CTR optimization variants
  // - device-based routing

  return enriched;
}

// ============================
// EXPORTS
// ============================
module.exports = {
  detectCountry,
  resolveMarketplace,
  buildAmazonLink,
  normalizeProduct,
  batchNormalize,
  smartRoute
};
