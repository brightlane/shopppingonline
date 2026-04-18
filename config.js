// /config/config.js

module.exports = {
  amazon: {
    defaultTag: "your-affiliate-tag-20", // Change to your real Amazon affiliate tag
    country: "US", // Define the country or region for your target audience
  },

  system: {
    environment: "production", // Options: production, staging, development
    debug: false, // Enable for debugging (set to true in development)
  },

  affiliate: {
    trackingEnabled: true, // Enable tracking of affiliate sales
    cloakLinks: false, // Optionally cloak affiliate links if needed
  },

  seo: {
    autoIndex: true, // Whether to auto-generate robots.txt and sitemaps
    generateSitemaps: true, // Automatically generate sitemaps for SEO
  },
};
