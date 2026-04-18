const PRODUCT_INTELLIGENCE_ORCHESTRATOR = {

  log: function(msg) {
    console.log("[PRODUCT INTELLIGENCE]", msg);
  },

  /**
   * Product ranking parameters
   * These can be expanded as needed.
   */
  rankingFactors: {
    ratingWeight: 0.3,
    priceWeight: 0.2,
    reviewCountWeight: 0.2,
    keywordRelevanceWeight: 0.3
  },

  /**
   * Rank products based on metrics
   */
  rankProducts: function(products, keyword) {

    this.log("🔍 Ranking products based on predefined metrics...");

    const rankedProducts = products.map(product => {

      const score = this.calculateScore(product, keyword);

      return {
        ...product,
        score
      };
    });

    // Sort by score (highest first)
    rankedProducts.sort((a, b) => b.score - a.score);

    this.log("✅ Products ranked successfully.");

    return rankedProducts;
  },

  /**
   * Calculate product score based on weights
   */
  calculateScore: function(product, keyword) {

    let score = 0;

    // Rating: 0.3 weight
    score += (product.rating || 0) * this.rankingFactors.ratingWeight;

    // Price: 0.2 weight (lower price = higher score)
    score += (1 / (product.price + 1)) * this.rankingFactors.priceWeight;

    // Review count: 0.2 weight
    score += (product.reviews || 0) * this.rankingFactors.reviewCountWeight;

    // Keyword relevance: 0.3 weight (based on how well the product matches the target keyword)
    score += this.calculateKeywordRelevance(product.title, keyword) * this.rankingFactors.keywordRelevanceWeight;

    return score;
  },

  /**
   * Simple keyword relevance calculation (basic keyword matching)
   */
  calculateKeywordRelevance: function(productTitle, keyword) {

    const keywordLower = keyword.toLowerCase();
    const titleLower = productTitle.toLowerCase();

    const matches = titleLower.split(" ").filter(word => word.includes(keywordLower)).length;

    return matches;
  },

  /**
   * Fetch product info and rank them
   */
  getProductRanking: function(products, keyword) {

    this.log(`📦 Ranking products based on the keyword: "${keyword}"`);

    return this.rankProducts(products, keyword);
  },

  /**
   * Integrate with content strategy pipeline
   * This can be called to integrate products into content generation based on performance.
   */
  integrateWithContentPipeline: function(products, keyword) {

    const rankedProducts = this.getProductRanking(products, keyword);

    this.log("📈 Products ranked. Integrating with content generation...");

    // Return the top-ranked products for content integration
    return rankedProducts.slice(0, 5); // Use top 5 products
  },

  /**
   * MAIN FUNCTION
   */
  run: function(products, keyword) {

    this.log("🧠 Running product intelligence...");

    // Get top 5 ranked products
    const topRankedProducts = this.integrateWithContentPipeline(products, keyword);

    this.log("✅ Product intelligence run complete.");

    return topRankedProducts;
  }
};

module.exports = PRODUCT_INTELLIGENCE_ORCHESTRATOR;
