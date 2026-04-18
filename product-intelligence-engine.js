const fs = require("fs");

// Optional: replace with real Amazon PA-API client later
// const amazonApi = require("./amazon-api-client");

const PRODUCT_ENGINE = {
  cacheFile: "./cache/product-graph.json",

  log: function (msg) {
    console.log("[PRODUCT ENGINE]", msg);
  },

  // 📦 Load cached product graph
  loadCache: function () {
    try {
      if (!fs.existsSync(this.cacheFile)) return {};
      return JSON.parse(fs.readFileSync(this.cacheFile));
    } catch (e) {
      this.log("⚠ Cache load error");
      return {};
    }
  },

  // 💾 Save cache
  saveCache: function (data) {
    fs.mkdirSync("./cache", { recursive: true });
    fs.writeFileSync(this.cacheFile, JSON.stringify(data, null, 2));
  },

  // 🧠 Normalize any product input (Amazon / other APIs / manual feeders)
  normalizeProduct: function (p) {
    return {
      asin: p.asin || null,
      title: p.title || "Untitled Product",
      price: parseFloat(p.price || 0),
      rating: parseFloat(p.rating || 0),
      reviews: parseInt(p.reviews || 0),
      image: p.image || "",
      category: p.category || "general",
      keywords: p.keywords || [],
      source: p.source || "unknown"
    };
  },

  // 📊 Scoring engine (THIS is your money logic)
  scoreProduct: function (p) {
    let score = 0;

    // rating weight
    score += (p.rating || 0) * 10;

    // review trust signal
    score += Math.log10((p.reviews || 1)) * 5;

    // price positioning (mid-range performs best in affiliate systems)
    if (p.price > 20 && p.price < 200) score += 15;

    // missing data penalty
    if (!p.image) score -= 10;
    if (!p.asin) score -= 50;

    return Math.round(score);
  },

  // 🧠 Build product cluster (intent grouping)
  clusterProduct: function (product) {
    const clusters = [];

    const title = product.title.toLowerCase();

    if (title.includes("wireless") || title.includes("bluetooth")) {
      clusters.push("wireless-tech");
    }

    if (title.includes("vacuum") || title.includes("cleaner")) {
      clusters.push("home-cleaning");
    }

    if (title.includes("laptop") || title.includes("macbook")) {
      clusters.push("computing");
    }

    if (title.includes("air fryer") || title.includes("kitchen")) {
      clusters.push("kitchen");
    }

    return clusters.length ? clusters : ["general"];
  },

  // 📦 ingest products from any source (API or feeder system)
  ingest: function (products = []) {
    const cache = this.loadCache();

    const enriched = products.map(p => {
      const product = this.normalizeProduct(p);

      product.score = this.scoreProduct(product);
      product.clusters = this.clusterProduct(product);

      return product;
    });

    enriched.forEach(p => {
      if (p.asin) {
        cache[p.asin] = p;
      }
    });

    this.saveCache(cache);

    this.log(`Ingested ${enriched.length} products`);

    return enriched;
  },

  // 🔍 retrieve best products by intent
  query: function ({ cluster = "general", minScore = 0, limit = 10 }) {
    const cache = this.loadCache();

    let results = Object.values(cache);

    results = results.filter(p =>
      p.score >= minScore &&
      (p.clusters || []).includes(cluster)
    );

    results.sort((a, b) => b.score - a.score);

    return results.slice(0, limit);
  },

  // 🌍 intent mapping (connects to your geo + intent router)
  mapIntentToCluster: function (intent, region = "global") {
    if (intent === "purchase") return "wireless-tech";
    if (intent === "comparison") return "general";
    if (intent === "home") return "home-cleaning";
    if (intent === "kitchen") return "kitchen";

    return "general";
  },

  // 🚀 main execution pipeline
  run: function (inputProducts, context = {}) {
    this.log("Running product intelligence pipeline...");

    const enriched = this.ingest(inputProducts);

    const cluster = this.mapIntentToCluster(
      context.intent,
      context.region
    );

    const top = this.query({
      cluster,
      minScore: 20,
      limit: 10
    });

    this.log(`Cluster selected: ${cluster}`);
    this.log(`Top products found: ${top.length}`);

    return {
      cluster,
      products: top
    };
  }
};

module.exports = PRODUCT_ENGINE;
