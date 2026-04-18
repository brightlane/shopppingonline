const KEYWORD_INTENT_ENGINE = {

  log: function(msg) {
    console.log("[KEYWORD ENGINE]", msg);
  },

  /**
   * CORE INTENT MAP
   * (This replaces random keyword injection with structured SEO logic)
   */
  intentMap: {
    "buying_intent": ["best", "buy", "cheap", "affordable", "discount", "deal"],
    "comparison_intent": ["vs", "versus", "compare", "difference"],
    "review_intent": ["review", "is it worth it", "should I buy"],
    "solution_intent": ["how to", "fix", "solve", "guide"],
    "brand_intent": ["apple", "samsung", "sony", "anker"]
  },

  /**
   * MAIN ENTRY
   */
  analyzeKeywords: function(keywordList) {

    this.log("🧠 Analyzing keyword intent clusters...");

    const clusters = {
      buying: [],
      comparison: [],
      review: [],
      solution: [],
      brand: [],
      general: []
    };

    keywordList.forEach(keyword => {

      const k = keyword.toLowerCase();

      if (this.matchesIntent(k, "buying_intent")) {
        clusters.buying.push(keyword);

      } else if (this.matchesIntent(k, "comparison_intent")) {
        clusters.comparison.push(keyword);

      } else if (this.matchesIntent(k, "review_intent")) {
        clusters.review.push(keyword);

      } else if (this.matchesIntent(k, "solution_intent")) {
        clusters.solution.push(keyword);

      } else if (this.matchesIntent(k, "brand_intent")) {
        clusters.brand.push(keyword);

      } else {
        clusters.general.push(keyword);
      }
    });

    this.log("✅ Keyword clustering complete");

    return clusters;
  },

  /**
   * CHECK INTENT MATCH
   */
  matchesIntent: function(keyword, intentType) {

    return this.intentMap[intentType].some(word =>
      keyword.includes(word)
    );
  },

  /**
   * BUILD CONTENT STRATEGY FROM KEYWORDS
   */
  buildContentPlan: function(keywordClusters, products) {

    this.log("📊 Building content strategy map...");

    const plan = [];

    // Buying intent → product listicles
    keywordClusters.buying.forEach(k => {
      plan.push({
        type: "listicle",
        keyword: k,
        angle: "best products",
        products: this.pickProducts(products, 5)
      });
    });

    // Comparison intent → vs articles
    keywordClusters.comparison.forEach(k => {
      plan.push({
        type: "comparison",
        keyword: k,
        angle: "vs battle",
        products: this.pickProducts(products, 2)
      });
    });

    // Review intent → deep reviews
    keywordClusters.review.forEach(k => {
      plan.push({
        type: "review",
        keyword: k,
        angle: "in-depth review",
        products: this.pickProducts(products, 1)
      });
    });

    // Solution intent → guides
    keywordClusters.solution.forEach(k => {
      plan.push({
        type: "guide",
        keyword: k,
        angle: "how-to guide",
        products: this.pickProducts(products, 1)
      });
    });

    return plan;
  },

  /**
   * PRODUCT SELECTION ENGINE
   */
  pickProducts: function(products, count) {

    return products
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  },

  /**
   * GENERATE ARTICLE BLUEPRINT (NOT FULL ARTICLE YET)
   */
  generateBlueprint: function(planItem) {

    return {
      title: this.generateTitle(planItem),
      keyword: planItem.keyword,
      type: planItem.type,
      structure: this.generateStructure(planItem.type),
      products: planItem.products
    };
  },

  /**
   * TITLE GENERATION
   */
  generateTitle: function(planItem) {

    const keyword = planItem.keyword;

    switch(planItem.type) {

      case "listicle":
        return `Best Products for ${keyword} (Top Picks Guide)`;

      case "comparison":
        return `${keyword} Comparison – Which One Should You Buy?`;

      case "review":
        return `${keyword} Review – Honest Breakdown`;

      case "guide":
        return `How to ${keyword} – Complete Guide`;

      default:
        return `${keyword} Guide`;
    }
  },

  /**
   * ARTICLE STRUCTURE TEMPLATE
   */
  generateStructure: function(type) {

    const base = [
      "Introduction",
      "Main Content",
      "Product Breakdown",
      "Pros & Cons",
      "Final Verdict"
    ];

    if (type === "comparison") {
      return [
        "Introduction",
        "Side-by-Side Comparison",
        "Key Differences",
        "Winner Analysis",
        "Final Verdict"
      ];
    }

    if (type === "guide") {
      return [
        "Problem Overview",
        "Step-by-Step Guide",
        "Recommended Tools",
        "Common Mistakes",
        "Final Summary"
      ];
    }

    return base;
  },

  /**
   * FULL PIPELINE OUTPUT
   */
  run: function(keywords, products) {

    const clusters = this.analyzeKeywords(keywords);
    const plan = this.buildContentPlan(clusters, products);

    const blueprints = plan.map(p => this.generateBlueprint(p));

    this.log(`📦 Generated ${blueprints.length} content blueprints`);

    return {
      clusters,
      plan,
      blueprints
    };
  }
};

module.exports = KEYWORD_INTENT_ENGINE;
