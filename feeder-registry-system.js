const FEEDER_REGISTRY_SYSTEM = {
  log: function(msg) {
    console.log("[FEEDER SYSTEM]", msg);
  },

  feeders: [],

  register: function(feeder) {
    this.feeders.push(feeder);
  },

  run: async function(products = []) {
    this.log(`Running ${this.feeders.length} feeders...`);

    let data = products;

    for (let feeder of this.feeders) {
      try {
        this.log(`➡ Running feeder: ${feeder.name}`);

        if (feeder.enabled === false) continue;

        data = await feeder.apply(data);

      } catch (err) {
        this.log(`❌ Feeder failed: ${feeder.name}`);
        this.log(err.message);
      }
    }

    this.log("✅ All feeders complete");
    return data;
  },

  // Complete Feeders List
  feedersList: {
    core_system_feeders: [
      "Authority System",
      "Batch Merge Engine",
      "Engine Suite",
      "Entry Trigger",
      "Entry Engine",
      "System Master Controller",
      "System Reset",
      "Canonical Optimizer",
      "Pages Workflow"
    ],
    seo_feeders: [
      "Robots Feeder",
      "SEO Enhancer",
      "SEO Indexing Gate",
      "SEO Master Pipeline",
      "Sitemap Generator",
      "hreflang Feeder",
      "Global SEO Architecture",
      "Keyword Gap Scanner",
      "Cannibalization Fixer",
      "Featured Snippet Engine"
    ],
    product_feeders: [
      "Product Cluster Feeder",
      "Comparison Feeder",
      "Alternatives Feeder",
      "Accessory Feeder",
      "Use-case Feeder",
      "Problem Solution Feeder",
      "Compatibility Feeder",
      "Spec Feeder",
      "Budget Feeder",
      "Brand Feeder",
      "Entity Feeder"
    ],
    content_feeders: [
      "Content Expander",
      "Content Intelligence Master",
      "Content Network Feeder",
      "Editorial Feeder",
      "Short Post Feeder",
      "Carousel Feeder",
      "Thread Feeder",
      "Video Script Feeder",
      "Newsletter Feeder"
    ],
    geo_feeders: [
      "Language Per Page",
      "Country Store",
      "Currency Context",
      "Regional Use Case",
      "Local Review Feeder",
      "Local Authority Link",
      "Local Event Feeder",
      "Local Language Intent",
      "Shipping Time Feeder",
      "Import Availability Feeder"
    ],
    monetization_feeders: [
      "Affiliate Router",
      "Multi Affiliate Switcher",
      "Coupon Aggregator",
      "Lead Capture Feeder",
      "CTA Optimizer",
      "Best Pick Engine",
      "Conversion Booster"
    ],
    data_feeders: [
      "Price History Feeder",
      "Stock Watcher",
      "Rating Sentiment Feeder",
      "Return Rate Analyzer",
      "Decay Detector",
      "Winner Duplicator",
      "A/B Test Feeder"
    ],
    media_feeders: [
      "Image Alt Feeder",
      "YouTube Embed Feeder",
      "Video Publisher",
      "Image SERP Optimizer"
    ],
    distribution_feeders: [
      "Pin Feeder",
      "Social Thread Feeder",
      "Forum Seeder",
      "UGC Collector",
      "Digital PR Feeder"
    ]
  },

  // Example Feeder Implementations
  SEO_FEEDER: {
    name: "SEO Enhancer",
    enabled: true,
    apply: async function(products) {
      return products.map(p => ({
        ...p,
        seoTitle: `${p.title} | Best Price Guide`,
        seoKeywords: [
          "best",
          "review",
          "buy",
          "cheap",
          "top rated"
        ]
      }));
    }
  },

  PRODUCT_CLUSTER_FEEDER: {
    name: "Product Cluster Feeder",
    enabled: true,
    apply: async function(products) {
      return products.map(p => {
        let clusters = [];

        const t = (p.title || "").toLowerCase();

        if (t.includes("laptop")) clusters.push("computing");
        if (t.includes("vacuum")) clusters.push("home-cleaning");
        if (t.includes("air fryer")) clusters.push("kitchen");
        if (t.includes("headphone")) clusters.push("audio");

        return {
          ...p,
          clusters
        };
      });
    }
  },

  BUDGET_FEEDER: {
    name: "Budget Feeder",
    enabled: true,
    apply: async function(products) {
      return products.map(p => ({
        ...p,
        budgetTier:
          p.price < 50 ? "low" :
          p.price < 200 ? "mid" :
          "premium"
      }));
    }
  },

  AFFILIATE_ROUTER_FEEDER: {
    name: "Affiliate Router",
    enabled: true,
    apply: async function(products) {
      return products.map(p => ({
        ...p,
        affiliateUrl: `https://amazon.com/dp/${p.asin}?tag=brightlane201-20`
      }));
    }
  },

  // Initialization system: registering all feeders
  init: function() {
    this.log("Initializing feeder system...");

    // Register all feeder categories
    Object.values(this.feedersList).flat().forEach(feederName => {
      if (this[feederName]) {
        this.register(this[feederName]);
      }
    });

    this.log(`Loaded ${this.feeders.length} active feeders`);
  }
};

// Initialize the system
FEEDER_REGISTRY_SYSTEM.init();

module.exports = FEEDER_REGISTRY_SYSTEM;
