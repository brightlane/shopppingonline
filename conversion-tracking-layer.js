const CONVERSION_TRACKING_LAYER = {

  log: function(msg) {
    console.log("[CONVERSION LAYER]", msg);
  },

  /**
   * MEMORY STORE (in production replace with DB)
   */
  memory: {
    clicks: {},
    conversions: {},
    revenue: {},
    scoreBoost: {}
  },

  /**
   * TRACK CLICK
   */
  trackClick: function(asin, context = {}) {

    if (!this.memory.clicks[asin]) {
      this.memory.clicks[asin] = 0;
    }

    this.memory.clicks[asin]++;

    this.log(`👆 Click tracked: ${asin}`);

    this.applyTemporaryBoost(asin, 0.2);

    return true;
  },

  /**
   * TRACK CONVERSION
   */
  trackConversion: function(asin, value = 0) {

    if (!this.memory.conversions[asin]) {
      this.memory.conversions[asin] = 0;
    }

    if (!this.memory.revenue[asin]) {
      this.memory.revenue[asin] = 0;
    }

    this.memory.conversions[asin]++;
    this.memory.revenue[asin] += value;

    this.log(`💰 Conversion tracked: ${asin} ($${value})`);

    this.applyPermanentBoost(asin, 1.0);

    return true;
  },

  /**
   * TEMP BOOST (short-term ranking boost)
   */
  applyTemporaryBoost: function(asin, amount) {

    if (!this.memory.scoreBoost[asin]) {
      this.memory.scoreBoost[asin] = 0;
    }

    this.memory.scoreBoost[asin] += amount;
  },

  /**
   * PERMANENT BOOST (real performer)
   */
  applyPermanentBoost: function(asin, amount) {

    if (!this.memory.scoreBoost[asin]) {
      this.memory.scoreBoost[asin] = 0;
    }

    this.memory.scoreBoost[asin] += amount * 5;
  },

  /**
   * GET PERFORMANCE SCORE
   */
  getPerformanceScore: function(asin) {

    const clicks = this.memory.clicks[asin] || 0;
    const conv = this.memory.conversions[asin] || 0;
    const revenue = this.memory.revenue[asin] || 0;
    const boost = this.memory.scoreBoost[asin] || 0;

    let score = 0;

    // CTR efficiency
    if (clicks > 0) {
      score += (conv / clicks) * 100;
    }

    // revenue weight
    score += revenue * 0.1;

    // behavioral boost
    score += boost;

    return score;
  },

  /**
   * GLOBAL RANKING UPDATE (feeds back into orchestrator)
   */
  getTopPerformers: function(limit = 10) {

    const all = Object.keys(this.memory.clicks);

    const ranked = all.map(asin => ({
      asin,
      score: this.getPerformanceScore(asin),
      clicks: this.memory.clicks[asin],
      conversions: this.memory.conversions[asin],
      revenue: this.memory.revenue[asin]
    }));

    return ranked
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },

  /**
   * AUTO DOWNRANK POOR PERFORMERS
   */
  getLowPerformers: function() {

    return Object.keys(this.memory.clicks)
      .filter(asin => this.getPerformanceScore(asin) < 1)
      .map(asin => ({
        asin,
        score: this.getPerformanceScore(asin)
      }));
  },

  /**
   * FEEDBACK INTO INTELLIGENCE ENGINE
   */
  getScoreModifier: function(asin) {

    const score = this.getPerformanceScore(asin);

    if (score > 50) return 2.0;   // winner boost
    if (score > 20) return 1.5;
    if (score > 5) return 1.1;
    if (score < 1) return 0.5;    // kill weak products

    return 1.0;
  },

  /**
   * INJECT INTO PRODUCT INTELLIGENCE PIPELINE
   */
  enrichProducts: function(products) {

    return products.map(p => {

      const boost = this.getScoreModifier(p.asin);

      return {
        ...p,
        performanceScore: this.getPerformanceScore(p.asin),
        dynamicBoost: boost
      };
    });
  }
};

module.exports = CONVERSION_TRACKING_LAYER;
