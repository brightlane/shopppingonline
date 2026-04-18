const PRODUCT_INTELLIGENCE_ORCHESTRATOR = {

  log: function(msg) {
    console.log("[INTELLIGENCE ORCHESTRATOR]", msg);
  },

  /**
   * MAIN ENTRY
   * products → raw amazon-style data
   * feeders → FEEDER_REGISTRY_SYSTEM
   * region → US/UK/DE/etc
   */
  run: async function(products, feeders, region = "us") {

    this.log("🚀 Starting intelligence pipeline...");

    // STEP 1: run feeder system
    let enriched = await feeders.run(products);

    // STEP 2: score products
    enriched = this.scoreProducts(enriched);

    // STEP 3: rank products
    enriched = this.rankProducts(enriched);

    // STEP 4: apply global routing
    enriched = this.applyGeoRouting(enriched, region);

    // STEP 5: inject affiliate links
    enriched = this.injectAffiliateLinks(enriched, region);

    // STEP 6: select winners
    const winners = this.selectWinners(enriched);

    this.log(`✅ Pipeline complete: ${winners.length} winners selected`);

    return winners;
  },

  /**
   * SCORE ENGINE (core monetization logic)
   */
  scoreProducts: function(products) {
    return products.map(p => {

      let score = 0;

      // rating weight
      score += (p.rating || 0) * 2;

      // review weight
      score += Math.min((p.reviews || 0) / 100, 10);

      // price advantage (mid-range sweet spot)
      if (p.price > 50 && p.price < 300) score += 5;

      // cluster boost
      if (p.clusters?.length > 0) score += 3;

      // SEO boost
      if (p.seoKeywords?.includes("best")) score += 2;

      return {
        ...p,
        score
      };
    });
  },

  /**
   * SORT BY VALUE
   */
  rankProducts: function(products) {
    return products.sort((a, b) => b.score - a.score);
  },

  /**
   * GEO ROUTING
   */
  applyGeoRouting: function(products, region) {
    return products.map(p => {

      let currency = "USD";
      let domain = "amazon.com";

      if (region === "uk") {
        currency = "GBP";
        domain = "amazon.co.uk";
      }

      if (region === "de") {
        currency = "EUR";
        domain = "amazon.de";
      }

      return {
        ...p,
        geo: { region, currency, domain }
      };
    });
  },

  /**
   * AFFILIATE INJECTION
   */
  injectAffiliateLinks: function(products, region) {
    return products.map(p => {

      const domain = p.geo?.domain || "amazon.com";

      return {
        ...p,
        affiliateUrl: `https://${domain}/dp/${p.asin}?tag=brightlane201-20`
      };
    });
  },

  /**
   * WINNER SELECTION ENGINE
   */
  selectWinners: function(products) {

    // top 20% = money products
    const cutoff = Math.max(1, Math.floor(products.length * 0.2));

    const winners = products.slice(0, cutoff);

    return winners.map(p => ({
      ...p,
      badge: this.assignBadge(p)
    }));
  },

  /**
   * BADGE SYSTEM (conversion psychology layer)
   */
  assignBadge: function(product) {

    if (product.score > 15) return "🔥 BEST PICK";
    if (product.price < 50) return "💰 BUDGET DEAL";
    if (product.rating >= 4.5) return "⭐ TOP RATED";
    return "✔ RECOMMENDED";
  },

  /**
   * CONNECT TO FRONTEND
   */
  render: function(products) {

    return products.map(p => `
      <a class="card" href="${p.affiliateUrl}">
        <div class="badge">${p.badge}</div>
        <div class="title">${p.title}</div>
        <div class="desc">${p.description || ""}</div>
        <div class="review">${p.rating} ⭐ (${p.reviews} reviews)</div>
      </a>
    `).join("");
  }
};

module.exports = PRODUCT_INTELLIGENCE_ORCHESTRATOR;
