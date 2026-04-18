const AFFILIATE_ROUTER = {
  // 🔑 Your affiliate tags per region
  tags: {
    us: "brightlane201-20",
    uk: "brightlane201-21",
    de: "brightlane201-21",
    ca: "brightlane201-20",
    au: "brightlane201-21"
  },

  // 🌍 Amazon domain mapping
  domains: {
    us: "amazon.com",
    uk: "amazon.co.uk",
    de: "amazon.de",
    ca: "amazon.ca",
    au: "amazon.com.au",
    jp: "amazon.co.jp"
  },

  log: function (msg) {
    console.log("[AFFILIATE ROUTER]", msg);
  },

  // 🧠 detect country (placeholder for IP/geo later)
  detectCountry: function (context = {}) {
    return context.country || "us";
  },

  // 🔗 build correct affiliate link
  buildLink: function (asin, country = "us") {
    const domain = this.domains[country] || this.domains.us;
    const tag = this.tags[country] || this.tags.us;

    return `https://${domain}/dp/${asin}?tag=${tag}`;
  },

  // 🔁 rewrite full product object
  attachAffiliate: function (product, context = {}) {
    const country = this.detectCountry(context);

    const affiliateUrl = this.buildLink(product.asin, country);

    this.log(`Generated link for ${product.title} → ${country}`);

    return {
      ...product,
      country,
      affiliateUrl
    };
  },

  // 📦 batch processor (important for your feeder system)
  processBatch: function (products, context = {}) {
    return products.map(p => this.attachAffiliate(p, context));
  }
};

module.exports = AFFILIATE_ROUTER;
