const CTR_OPTIMIZER_ENGINE = {

  log: function(msg) {
    console.log("[CTR OPTIMIZER]", msg);
  },

  /**
   * CONFIG
   */
  config: {
    variantsPerArticle: 5,
    emojiSet: ["🔥", "✅", "⭐", "⚡", "🏆"],
    powerWords: ["Best", "Top", "Ultimate", "Proven", "Smart", "Affordable"]
  },

  /**
   * MAIN ENTRY
   */
  run: function(articles) {

    this.log("🎯 Generating CTR variants...");

    return articles.map(article => {

      const variants = this.generateVariants(article.title);

      return {
        ...article,
        ctrVariants: variants,
        metaDescriptions: this.generateMetaDescriptions(article.title)
      };
    });
  },

  /**
   * TITLE VARIANTS
   */
  generateVariants: function(title) {

    const variants = [];

    for (let i = 0; i < this.config.variantsPerArticle; i++) {

      const emoji = this.pickRandom(this.config.emojiSet);
      const power = this.pickRandom(this.config.powerWords);

      variants.push(
        `${emoji} ${power} ${title} (${new Date().getFullYear()})`
      );

      variants.push(
        `${power} Guide: ${title} You Shouldn’t Miss`
      );

      variants.push(
        `${title} – What Actually Works in ${new Date().getFullYear()}`
      );
    }

    return [...new Set(variants)].slice(0, this.config.variantsPerArticle);
  },

  /**
   * META DESCRIPTION GENERATOR
   */
  generateMetaDescriptions: function(title) {

    return [
      `Discover the ${title}. Compare features, pricing, and find the best option today.`,
      `Looking for ${title}? See top picks, reviews, and expert recommendations.`,
      `Find out which ${title} is worth buying with our detailed guide.`
    ];
  },

  /**
   * PICK RANDOM HELPER
   */
  pickRandom: function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  /**
   * PERFORMANCE EVALUATION
   */
  evaluateCTR: function(data) {

    this.log("📊 Evaluating CTR performance...");

    return data.map(d => {

      const ctr = d.clicks / (d.impressions || 1);

      return {
        ...d,
        ctr
      };
    });
  },

  /**
   * SELECT WINNER VARIANT
   */
  pickWinners: function(variantData) {

    this.log("🏆 Selecting best CTR variants...");

    return variantData.map(v => {

      const best = v.variants.sort((a, b) => b.ctr - a.ctr)[0];

      return {
        articleId: v.articleId,
        bestVariant: best
      };
    });
  }

};

module.exports = CTR_OPTIMIZER_ENGINE;
