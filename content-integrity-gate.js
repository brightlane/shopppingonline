const CONTENT_INTEGRITY_GATE = {

  log: function(msg) {
    console.log("[CONTENT INTEGRITY]", msg);
  },

  /**
   * DEFAULT CATEGORY FALLBACK IMAGES
   */
  fallbackImages: {
    default: "https://via.placeholder.com/300x300?text=Product",
    laptop: "https://via.placeholder.com/300x300?text=Laptop",
    audio: "https://via.placeholder.com/300x300?text=Audio",
    kitchen: "https://via.placeholder.com/300x300?text=Kitchen",
    home: "https://via.placeholder.com/300x300?text=Home",
    tech: "https://via.placeholder.com/300x300?text=Tech",
    fitness: "https://via.placeholder.com/300x300?text=Fitness"
  },

  /**
   * MAIN CLEANING PIPELINE
   */
  clean: function(products, strictMode = false) {

    this.log("🧹 Running content integrity check...");

    return products
      .map(p => this.normalize(p))
      .filter(p => strictMode ? this.isValid(p) : true);
  },

  /**
   * NORMALIZE PRODUCT
   */
  normalize: function(product) {

    const cleanTitle = this.cleanText(product.title, "Untitled Product");
    const cleanDesc = this.cleanText(product.description, "");
    const cleanImage = this.fixImage(product);

    return {
      ...product,
      title: cleanTitle,
      description: cleanDesc,
      image: cleanImage
    };
  },

  /**
   * CLEAN TEXT FIELDS
   */
  cleanText: function(value, fallback) {

    if (!value) return fallback;

    const invalid = ["-", "N/A", "null", "undefined", ""];

    if (invalid.includes(value)) return fallback;

    return value;
  },

  /**
   * IMAGE VALIDATION + FIX
   */
  fixImage: function(product) {

    const invalid = ["-", "N/A", "", null, undefined];

    if (!product.image || invalid.includes(product.image)) {
      return this.getFallbackByCategory(product);
    }

    return product.image;
  },

  /**
   * CATEGORY-BASED FALLBACK IMAGE
   */
  getFallbackByCategory: function(product) {

    const title = (product.title || "").toLowerCase();

    if (title.includes("laptop")) return this.fallbackImages.laptop;
    if (title.includes("headphone") || title.includes("speaker")) return this.fallbackImages.audio;
    if (title.includes("air fryer") || title.includes("kitchen")) return this.fallbackImages.kitchen;
    if (title.includes("vacuum") || title.includes("home")) return this.fallbackImages.home;
    if (title.includes("fitness") || title.includes("bike")) return this.fallbackImages.fitness;

    return this.fallbackImages.default;
  },

  /**
   * VALIDATION RULES
   */
  isValid: function(product) {

    if (!product.title || product.title === "Untitled Product") {
      this.log(`❌ Invalid product (title): ${product.asin}`);
      return false;
    }

    if (!product.asin) {
      this.log(`❌ Invalid product (ASIN missing)`);
      return false;
    }

    if (!product.image) {
      this.log(`❌ Invalid product (image missing): ${product.asin}`);
      return false;
    }

    return true;
  },

  /**
   * PRE-RENDER SAFETY CHECK
   */
  prepareForRender: function(products) {

    this.log("🎯 Preparing safe render output...");

    return this.clean(products, false);
  },

  /**
   * STRICT MODE (no weak products allowed)
   */
  prepareStrict: function(products) {

    this.log("🚨 STRICT MODE ACTIVE");

    return this.clean(products, true);
  }
};

module.exports = CONTENT_INTEGRITY_GATE;
