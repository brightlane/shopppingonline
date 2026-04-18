const AI_CONTENT_REWRITER = {
  // Define the rules for SEO
  seoKeywords: [
    'buy online', 'best price', 'top rated', 'exclusive deal', 'new arrivals', 'free shipping', 'discounts', 'best seller', 'customer favorites', 'limited stock'
  ],

  log: function(msg) {
    console.log("[AI CONTENT REWRITER]", msg);
  },

  /**
   * Rewrite product title for SEO and engagement
   */
  rewriteTitle: function(title) {
    // Make sure title has SEO keywords
    let seoTitle = title;

    // Add a keyword if not already present
    if (!seoTitle.toLowerCase().includes("best price")) {
      seoTitle += " - Best Price Guaranteed!";
    }

    if (!seoTitle.toLowerCase().includes("top rated")) {
      seoTitle += " - Top Rated!";
    }

    this.log(`Rewritten Title: ${seoTitle}`);
    return seoTitle;
  },

  /**
   * Rewrite product description for SEO
   */
  rewriteDescription: function(description, productCategory) {
    // Add SEO keywords for better search optimization
    let seoDescription = description || "";

    // Add some default SEO booster words based on category
    if (productCategory.includes("laptop")) {
      seoDescription += " - Buy the latest laptops at unbeatable prices. Shop now for fast delivery and amazing deals!";
    } else if (productCategory.includes("headphone")) {
      seoDescription += " - Get high-quality headphones with superior sound. Find top-rated models with free shipping!";
    } else if (productCategory.includes("vacuum")) {
      seoDescription += " - Shop the best vacuums for deep cleaning your home. Get discounts on top-rated models!";
    }

    // Ensure SEO keywords are included
    this.seoKeywords.forEach(keyword => {
      if (!seoDescription.toLowerCase().includes(keyword)) {
        seoDescription += ` ${keyword}`;
      }
    });

    this.log(`Rewritten Description: ${seoDescription}`);
    return seoDescription;
  },

  /**
   * Auto-generate SEO product blurbs for each product
   */
  generateSEOBlurb: function(product) {
    // Generate a concise SEO-optimized product blurb
    const { title, description, category } = product;

    // Rewrite the title and description
    const newTitle = this.rewriteTitle(title);
    const newDescription = this.rewriteDescription(description, category);

    return {
      title: newTitle,
      description: newDescription
    };
  },

  /**
   * Run content rewriter across the entire product list
   */
  processProductList: function(products) {
    this.log("🚀 Running content rewriter...");

    return products.map(product => {
      return {
        ...product,
        ...this.generateSEOBlurb(product)
      };
    });
  }
};

module.exports = AI_CONTENT_REWRITER;
