const ADAPTIVE_STRATEGY_ENGINE = {

  log: function(msg) {
    console.log("[ADAPTIVE STRATEGY]", msg);
  },

  /**
   * CONFIG
   */
  config: {
    minCTR: 0.02,
    minConversionRate: 0.01,
    minRevenue: 5,
    boostMultiplier: 1.5,
    decayMultiplier: 0.5
  },

  /**
   * MAIN ENTRY
   */
  run: function(contentReports) {

    this.log("🧠 Running adaptive strategy engine...");

    const winners = [];
    const losers = [];

    contentReports.forEach(report => {

      const score = this.calculatePerformanceScore(report);

      if (score > 1) {
        winners.push({ ...report, score });
      } else {
        losers.push({ ...report, score });
      }
    });

    this.log(`🏆 Winners: ${winners.length}`);
    this.log(`💀 Losers: ${losers.length}`);

    const strategy = this.buildStrategy(winners, losers);

    return {
      winners,
      losers,
      strategy
    };
  },

  /**
   * PERFORMANCE SCORING
   */
  calculatePerformanceScore: function(report) {

    const ctr = report.clicks / (report.impressions || 1);
    const conversionRate = report.conversions / (report.clicks || 1);
    const revenueScore = report.revenue / 10;

    let score = 0;

    if (ctr > this.config.minCTR) score += 1;
    if (conversionRate > this.config.minConversionRate) score += 1;
    if (report.revenue > this.config.minRevenue) score += 1;

    return score + revenueScore;
  },

  /**
   * BUILD STRATEGY
   */
  buildStrategy: function(winners, losers) {

    return {
      scale: this.scaleWinners(winners),
      fix: this.fixLosers(losers),
      expand: this.expandKeywords(winners)
    };
  },

  /**
   * SCALE WINNERS
   */
  scaleWinners: function(winners) {

    this.log("🚀 Scaling winning content...");

    return winners.map(w => ({
      keyword: w.keyword,
      action: "duplicate + expand",
      newArticles: Math.ceil(w.score * this.config.boostMultiplier)
    }));
  },

  /**
   * FIX OR REMOVE LOSERS
   */
  fixLosers: function(losers) {

    this.log("🔧 Fixing or removing underperformers...");

    return losers.map(l => {

      if (l.revenue < 1) {
        return {
          keyword: l.keyword,
          action: "deprecate"
        };
      }

      return {
        keyword: l.keyword,
        action: "rewrite + reposition"
      };
    });
  },

  /**
   * KEYWORD EXPANSION ENGINE
   */
  expandKeywords: function(winners) {

    this.log("🌍 Expanding keyword universe...");

    const expansions = [];

    winners.forEach(w => {

      const base = w.keyword;

      expansions.push(`${base} for beginners`);
      expansions.push(`${base} best budget`);
      expansions.push(`${base} vs alternatives`);
      expansions.push(`top rated ${base}`);
      expansions.push(`${base} review 2026`);
    });

    return [...new Set(expansions)];
  },

  /**
   * GENERATE NEW CONTENT TASKS
   */
  generateNextTasks: function(strategy) {

    this.log("📦 Generating next content tasks...");

    const tasks = [];

    strategy.scale.forEach(s => {
      for (let i = 0; i < s.newArticles; i++) {
        tasks.push({
          keyword: s.keyword,
          type: "expansion"
        });
      }
    });

    strategy.expand.forEach(k => {
      tasks.push({
        keyword: k,
        type: "new"
      });
    });

    return tasks;
  }

};

module.exports = ADAPTIVE_STRATEGY_ENGINE;
