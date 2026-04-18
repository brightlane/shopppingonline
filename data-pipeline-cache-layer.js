const CONTENT_ARTICLE_ENGINE = {

  log: function(msg) {
    console.log("[ARTICLE ENGINE]", msg);
  },

  /**
   * KEYWORD POOL (NOT STUFFED — NATURAL USAGE ONLY)
   */
  keywords: [
    "best products",
    "top rated",
    "buy online",
    "affordable options",
    "expert review",
    "value for money",
    "amazon deals",
    "recommended picks",
    "high performance",
    "budget friendly"
  ],

  /**
   * MAIN ENTRY
   */
  generateArticles: function(products, count = 3) {

    this.log(`🧠 Generating ${count} SEO articles...`);

    const articles = [];

    for (let i = 0; i < count; i++) {
      const productSet = this.pickProducts(products, 3);
      articles.push(this.buildArticle(productSet, i));
    }

    return articles;
  },

  /**
   * PICK PRODUCTS FOR ARTICLE
   */
  pickProducts: function(products, limit) {
    return products
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  },

  /**
   * BUILD ARTICLE (SEO SAFE STRUCTURE)
   */
  buildArticle: function(products, index) {

    const keyword = this.pickKeyword();
    const title = this.generateTitle(products[0], keyword);

    const content = `
# ${title}

## Introduction

Finding the ${keyword} can be overwhelming. This guide breaks down carefully selected options based on performance, price, and real-world usability.

---

## Top Picks

${products.map(p => this.renderProductSection(p)).join("\n\n")}

---

## Buying Guide

When choosing among these options, consider durability, performance, and long-term value. The goal is not just to buy, but to invest in the right product.

---

## Final Verdict

Each product listed above has been selected based on quality, user feedback, and overall value for money. Choose based on your needs and budget.
`;

    return {
      id: `article_${index}`,
      title,
      content,
      keyword
    };
  },

  /**
   * PRODUCT SECTION (AFFILIATE SAFE FORMAT)
   */
  renderProductSection: function(product) {

    return `
### ${product.title}

**Rating:** ${product.rating || "4.5"} ⭐  
**Price:** ${product.price || "Check Amazon"}  

${product.description || "High-quality product with strong performance and reliability."}

👉 [View on Amazon](https://amazon.com/dp/${product.asin}?tag=brightlane201-20)
`;
  },

  /**
   * TITLE GENERATOR (SEO SAFE)
   */
  generateTitle: function(product, keyword) {
    return `Best ${product.title} Options – ${keyword} Guide 2026`;
  },

  /**
   * PICK KEYWORD NATURALLY
   */
  pickKeyword: function() {
    return this.keywords[Math.floor(Math.random() * this.keywords.length)];
  },

  /**
   * SIMPLE SCHEDULER (CONTROLLED OUTPUT)
   */
  schedule: function(products) {

    this.log("⏱ Scheduling article generation...");

    const batch = this.generateArticles(products, 3);

    return batch;
  }
};

module.exports = CONTENT_ARTICLE_ENGINE;
