const fs = require("fs");
const LEARNING_ENGINE = require("./learning-engine");

// Placeholder for feeder configurations (feeder classes, settings)
const FEEDERS = {
  SEO: require("./feeders/seo-feeder"),
  Content: require("./feeders/content-feeder"),
  Product: require("./feeders/product-feeder"),
  // Add all other feeders here
};

// Main Feeder Registry Handler
const FEEDER_REGISTRY = {
  // 📂 Load feeder configurations from a local cache or default
  load: function () {
    try {
      if (!fs.existsSync("./cache/feeders.json")) {
        console.log("[FEEDER REGISTRY] No feeder configuration found, initializing default.");
        return [];
      }
      return JSON.parse(fs.readFileSync("./cache/feeders.json"));
    } catch (error) {
      console.log("[FEEDER REGISTRY] Error loading feeder configurations:", error);
      return [];
    }
  },

  // 💾 Save feeder configurations to cache
  save: function (feeders) {
    fs.mkdirSync("./cache", { recursive: true });
    fs.writeFileSync("./cache/feeders.json", JSON.stringify(feeders, null, 2));
    console.log("[FEEDER REGISTRY] Feeders configuration saved.");
  },

  // 🛠 Register a new feeder
  registerFeeder: function (feederKey, config) {
    if (!FEEDERS[feederKey]) {
      console.log(`[FEEDER REGISTRY] Invalid feeder key: ${feederKey}`);
      return;
    }

    const feeders = this.load();
    feeders.push({ key: feederKey, config });
    this.save(feeders);
    console.log(`[FEEDER REGISTRY] Registered new feeder: ${feederKey}`);
  },

  // 📊 Analyze current system status and decide which feeders to prioritize
  prioritizeFeeders: function () {
    const strategy = LEARNING_ENGINE.getOptimizationSignal();

    const feeders = this.load();
    let prioritizedFeeders = [];

    if (strategy.mode === "SEO_BOOST") {
      prioritizedFeeders = feeders.filter(f => f.key === "SEO");
      console.log("[FEEDER REGISTRY] Prioritizing SEO feeders due to low conversion rate.");
    } else if (strategy.mode === "SCALE_PRODUCTS") {
      prioritizedFeeders = feeders.filter(f => f.key === "Product");
      console.log("[FEEDER REGISTRY] Prioritizing product feeders due to high revenue.");
    } else {
      prioritizedFeeders = feeders;
      console.log("[FEEDER REGISTRY] Using balanced feeder strategy.");
    }

    return prioritizedFeeders;
  },

  // 🔄 Execute the feeders in the right order
  executeFeeders: function () {
    const prioritizedFeeders = this.prioritizeFeeders();

    prioritizedFeeders.forEach(feeder => {
      console.log(`[FEEDER REGISTRY] Executing feeder: ${feeder.key}`);
      FEEDERS[feeder.key].execute(feeder.config);
    });
  }
};

module.exports = FEEDER_REGISTRY;
