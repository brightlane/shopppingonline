const MASTER_ORCHESTRATOR = {
  requiredFields: ["title", "asin"],

  log: function (msg) {
    console.log("[MASTER]", msg);
  },

  validateProduct: function (product) {
    for (let field of this.requiredFields) {
      if (!product[field]) {
        this.log(`❌ Missing field: ${field}`);
        return false;
      }
    }

    if (product.asin.length !== 10) {
      this.log(`❌ Invalid ASIN: ${product.asin}`);
      return false;
    }

    return true;
  },

  validateProductFile: function (products) {
    let valid = [];
    let invalid = [];

    products.forEach(p => {
      if (this.validateProduct(p)) {
        valid.push(p);
      } else {
        invalid.push(p);
      }
    });

    this.log(`✔ Valid products: ${valid.length}`);
    this.log(`⚠ Invalid products: ${invalid.length}`);

    return valid;
  },

  /**
   * Normalize product data before rendering
   */
  normalize: function (products) {
    return products.map(p => ({
      title: p.title || "Untitled Product",
      asin: p.asin,
      price: p.price || "",
      rating: p.rating || 0,
      reviews: p.reviews || 0,
      image: p.image || "",
      description: p.description || ""
    }));
  },

  /**
   * Run full system check
   */
  run: function (productData) {
    this.log("🚀 Running master validation...");

    const normalized = this.normalize(productData);
    const valid = this.validateProductFile(normalized);

    this.log("✅ System ready");

    return valid;
  }
};
