/**
 * affiliate-routing-brain.js
 * AAC Global Affiliate Routing System
 * Automatically selects correct Amazon marketplace per country
 */

const config = require("../config/config.js");

// === AMAZON MARKET MAP ===
const AMAZON_DOMAINS = {
  us: "amazon.com",
  ca: "amazon.ca",
  uk: "amazon.co.uk",
  de: "amazon.de",
  fr: "amazon.fr",
  es: "amazon.es",
  it: "amazon.it",
  nl: "amazon.nl",
  jp: "amazon.co.jp",
  au: "amazon.com.au",
  br: "amazon.com.br",
  in: "amazon.in",
  mx: "amazon.com.mx"
};

// === AFFILIATE TAG RULES ===
function getAffiliateTag(country) {
  // You can later expand per-region tags
  return config?.affiliateTag || "brightlane201-20";
}

// === DOMAIN RESOLUTION ===
function resolveDomain(country = "us") {
  return AMAZON_DOMAINS[country] || AMAZON_DOMAINS.us;
}

// === BUILD FULL AFFILIATE LINK ===
function buildAffiliateLink({ asin, country = "us", tag }) {
  const domain = resolveDomain(country);
  const affiliateTag = tag || getAffiliateTag(country);

  if (!asin) {
    return `https://${domain}/?tag=${affiliateTag}`;
  }

  return `https://${domain}/dp/${asin}?tag=${affiliateTag}`;
}

// === SMART ROUTING ENGINE (FUTURE CTR OPTIMIZER HOOK) ===
function routeByUserContext(product, context = {}) {
  const country = context.country || "us";
  const device = context.device || "desktop";

  let tag = getAffiliateTag(country);

  // CTR logic placeholder (future A/B testing layer)
  if (device === "mobile") {
    tag = tag; // hook for mobile-specific tracking later
  }

  return buildAffiliateLink({
    asin: product.asin,
    country,
    tag
  });
}

// === BATCH ROUTER (USED BY SEO ENGINE) ===
function applyRouting(products = [], country = "us") {
  return products.map(p => {
    return {
      ...p,
      affiliateUrl: buildAffiliateLink({
        asin: p.asin,
        country,
        tag: p.tag
      })
    };
  });
}

// === EXPORTS ===
module.exports = {
  resolveDomain,
  buildAffiliateLink,
  routeByUserContext,
  applyRouting
};
