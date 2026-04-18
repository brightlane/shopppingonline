const geoip = require("geoip-lite");

const GLOBAL_MARKET_ROUTER = {
  log: function (msg) {
    console.log("[GLOBAL MARKET ROUTER]", msg);
  },

  // 🌍 Amazon marketplaces map
  marketplaces: {
    US: { domain: "amazon.com", currency: "USD", tag: "brightlane201-20" },
    CA: { domain: "amazon.ca", currency: "CAD", tag: "brightlane201-20" },
    UK: { domain: "amazon.co.uk", currency: "GBP", tag: "brightlane201-21" },
    DE: { domain: "amazon.de", currency: "EUR", tag: "brightlane201-21" },
    FR: { domain: "amazon.fr", currency: "EUR", tag: "brightlane201-21" },
    IT: { domain: "amazon.it", currency: "EUR", tag: "brightlane201-21" },
    ES: { domain: "amazon.es", currency: "EUR", tag: "brightlane201-21" },
    JP: { domain: "amazon.co.jp", currency: "JPY", tag: "brightlane201-21" },
    AU: { domain: "amazon.com.au", currency: "AUD", tag: "brightlane201-21" }
  },

  // 🌍 detect user location from IP
  detectRegion: function (ip) {
    const geo = geoip.lookup(ip);

    if (!geo || !geo.country) {
      this.log("⚠ Unknown region, defaulting to US");
      return "US";
    }

    return geo.country;
  },

  // 💱 normalize price display
  formatPrice: function (price, currency) {
    if (!price) return "";

    const symbols = {
      USD: "$",
      CAD: "C$",
      GBP: "£",
      EUR: "€",
      JPY: "¥",
      AUD: "A$"
    };

    return `${symbols[currency] || ""}${price}`;
  },

  // 🔗 build affiliate link
  buildAffiliateLink: function (asin, region = "US") {
    const market = this.marketplaces[region] || this.marketplaces.US;

    return `https://${market.domain}/dp/${asin}?tag=${market.tag}`;
  },

  // 🧠 normalize product for global use
  normalizeProduct: function (product, region = "US") {
    const market = this.marketplaces[region] || this.marketplaces.US;

    return {
      asin: product.asin,
      title: product.title,
      price: this.formatPrice(product.price, market.currency),
      rawPrice: product.price,
      currency: market.currency,
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      image: product.image || "",
      region,
      marketplace: market.domain,
      affiliateUrl: this.buildAffiliateLink(product.asin, region)
    };
  },

  // 🌍 route product query to correct marketplace
  routeQuery: function (query, ip) {
    const region = this.detectRegion(ip);
    const market = this.marketplaces[region] || this.marketplaces.US;

    this.log(`Routing query "${query}" → ${region} (${market.domain})`);

    return {
      query,
      region,
      marketplace: market.domain,
      currency: market.currency,
      affiliateTag: market.tag
    };
  },

  // 📦 batch normalize products globally
  processProducts: function (products, ip) {
    const region = this.detectRegion(ip);

    return products.map(p => this.normalizeProduct(p, region));
  }
};

module.exports = GLOBAL_MARKET_ROUTER;
