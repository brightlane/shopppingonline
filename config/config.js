// /config/config.js
// SAFE GLOBAL CONFIG (NO DEPENDENCIES)

module.exports = {
  amazon: {
    defaultTag: "brightlane201-20",
    country: "US",
    trackingEnabled: true
  },

  system: {
    environment: "production",
    debug: false,
    version: "1.0.0"
  },

  affiliate: {
    enabled: true,
    cloakLinks: false
  },

  seo: {
    autoIndex: true,
    generateSitemap: true
  }
};
