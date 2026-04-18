const REAL_DATA_INGESTION_ENGINE = {

  log: function(msg) {
    console.log("[DATA ENGINE]", msg);
  },

  /**
   * CONFIG
   */
  config: {
    maxProducts: 50,
    maxKeywords: 100
  },

  /**
   * MAIN ENTRY
   */
  run: async function() {

    this.log("🌍 Starting real data ingestion...");

    const products = await this.fetchProducts();
    const keywords = await this.fetchKeywords(products);

    const normalizedProducts = this.normalizeProducts(products);
    const expandedKeywords = this.expandKeywords(keywords);

    return {
      products: normalizedProducts,
      keywords: expandedKeywords
    };
  },

  /**
   * FETCH PRODUCTS (API READY)
   * Replace with Amazon PA-API or other provider
   */
  fetchProducts: async function() {

    this.log("📦 Fetching product data...");

    // MOCK STRUCTURE (replace with real API)
    const sample = [];

    for (let i = 0; i < this.config.maxProducts; i++) {
      sample.push({
        asin: this.generateASIN(),
        title: `Sample Product ${i + 1}`,
        price: Math.floor(Math.random() * 200) + 10,
        rating: (Math.random() * 5).toFixed(1),
        reviews: Math.floor(Math.random() * 5000),
        image: `https://picsum.photos/seed/${i}/400/400`,
        category: "electronics"
      });
    }

    return sample;
  },

  /**
   * FETCH KEYWORDS BASED ON PRODUCTS
   */
  fetchKeywords: async function(products) {

    this.log("🔍 Generating keyword base...");

    const keywords = [];

    products.forEach(p => {

      keywords.push(p.title);
      keywords.push(`best ${p.title}`);
      keywords.push(`${p.title} review`);
      keywords.push(`${p.title} vs competitors`);
    });

    return keywords.slice(0, this.config.maxKeywords);
  },

  /**
   * NORMALIZE PRODUCT STRUCTURE
   */
  normalizeProducts: function(products) {

    this.log("🧹 Normalizing product data...");

    return products.map(p => ({
      asin: p.asin,
      title: p.title,
      price: parseFloat(p.price),
      rating: parseFloat(p.rating),
      reviews: p.reviews,
      image: p.image,
      category: p.category || "general"
    }));
  },

  /**
   * KEYWORD EXPANSION ENGINE
   */
  expandKeywords: function(keywords) {

    this.log("🌱 Expanding keyword set...");

    const expanded = [];

    keywords.forEach(k => {

      expanded.push(k);
      expanded.push(`top rated ${k}`);
      expanded.push(`${k} for beginners`);
      expanded.push(`${k} under $100`);
      expanded.push(`${k} 2026`);
    });

    return [...new Set(expanded)];
  },

  /**
   * ASIN GENERATOR (MOCK)
   */
  generateASIN: function() {

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let asin = "";

    for (let i = 0; i < 10; i++) {
      asin += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return asin;
  }

};

module.exports = REAL_DATA_INGESTION_ENGINE;
