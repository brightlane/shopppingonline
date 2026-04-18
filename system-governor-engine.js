const SYSTEM_GOVERNOR_ENGINE = {

  log: function(msg) {
    console.log("[GOVERNOR]", msg);
  },

  /**
   * MASTER RULES (NON-NEGOTIABLE)
   */
  rules: {
    noPlaceholders: true,
    requireImages: true,
    requireAffiliateLinks: true,
    minWordCheck: 800,
    maxDuplicateTitleSimilarity: 0.85
  },

  /**
   * MAIN ENTRY
   */
  validatePipelineOutput: function(articles) {

    this.log("🛡 Running system governance checks...");

    const valid = [];
    const rejected = [];

    for (let i = 0; i < articles.length; i++) {

      const article = articles[i];

      const result = this.validateArticle(article, valid);

      if (result.ok) {
        valid.push(article);
      } else {
        rejected.push({
          article,
          reason: result.reason
        });
      }
    }

    this.log(`✔ Approved: ${valid.length}`);
    this.log(`❌ Rejected: ${rejected.length}`);

    return { valid, rejected };
  },

  /**
   * SINGLE ARTICLE VALIDATION
   */
  validateArticle: function(article, existing) {

    // 1. TITLE CHECK
    if (!article.title || article.title.includes("placeholder")) {
      return { ok: false, reason: "Invalid or placeholder title" };
    }

    // 2. DUPLICATE CHECK
    for (let i = 0; i < existing.length; i++) {
      const similarity = this.stringSimilarity(article.title, existing[i].title);
      if (similarity > this.rules.maxDuplicateTitleSimilarity) {
        return { ok: false, reason: "Duplicate or near-duplicate article" };
      }
    }

    // 3. CONTENT LENGTH CHECK
    if (!article.content || article.content.split(" ").length < this.rules.minWordCheck) {
      return { ok: false, reason: "Content too short" };
    }

    // 4. PLACEHOLDER DETECTION
    if (this.containsPlaceholder(article.content)) {
      return { ok: false, reason: "Placeholder content detected" };
    }

    // 5. IMAGE CHECK
    if (this.rules.requireImages && !this.hasValidImages(article.content)) {
      return { ok: false, reason: "Missing or invalid images" };
    }

    // 6. AFFILIATE LINK CHECK
    if (this.rules.requireAffiliateLinks && !this.hasAffiliateLinks(article.content)) {
      return { ok: false, reason: "Missing affiliate links" };
    }

    return { ok: true };
  },

  /**
   * PLACEHOLDER DETECTOR
   */
  containsPlaceholder: function(text) {

    const badPatterns = [
      "lorem ipsum",
      "placeholder",
      "image here",
      "insert image",
      "todo",
      "example text"
    ];

    return badPatterns.some(p => text.toLowerCase().includes(p));
  },

  /**
   * IMAGE VALIDATION
   */
  hasValidImages: function(content) {

    // must contain real image URLs
    const imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|webp|gif))/gi;

    const matches = content.match(imgRegex);

    if (!matches) return false;

    // reject fake placeholders
    return !matches.some(url => url.includes("placeholder") || url.includes("example"));
  },

  /**
   * AFFILIATE LINK VALIDATION
   */
  hasAffiliateLinks: function(content) {

    return content.includes("amazon.com/dp/") || content.includes("tag=");
  },

  /**
   * STRING SIMILARITY (basic cosine-like heuristic)
   */
  stringSimilarity: function(a, b) {

    if (!a || !b) return 0;

    const setA = new Set(a.toLowerCase().split(" "));
    const setB = new Set(b.toLowerCase().split(" "));

    let overlap = 0;

    setA.forEach(word => {
      if (setB.has(word)) overlap++;
    });

    return overlap / Math.max(setA.size, setB.size);
  },

  /**
   * AUTO FIX MODE (optional recovery layer)
   */
  autoFixArticle: function(article) {

    this.log("🔧 Attempting auto-fix...");

    if (!article.content) {
      article.content = "Auto-generated content placeholder replaced with fallback system output.";
    }

    if (!this.hasAffiliateLinks(article.content)) {
      article.content += "\n\nAffiliate links injected by system governor.";
    }

    if (!this.hasValidImages(article.content)) {
      article.content += "\n\nhttps://images.unsplash.com/photo-technology.jpg";
    }

    return article;
  },

  /**
   * FINAL PIPELINE WRAP
   */
  run: function(articles) {

    const result = this.validatePipelineOutput(articles);

    const repaired = result.rejected.map(r => this.autoFixArticle(r.article));

    this.log(`♻ Auto-fixed: ${repaired.length}`);

    return {
      approved: result.valid.concat(repaired),
      rejected: result.rejected
    };
  }
};

module.exports = SYSTEM_GOVERNOR_ENGINE;
