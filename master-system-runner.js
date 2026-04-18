const fs = require("fs");

const MASTER_SYSTEM_RUNNER = {

  log: function(msg) {
    console.log("[MASTER RUNNER]", msg);
  },

  /**
   * LOAD ALL MODULES
   */
  loadSystem: function() {

    this.log("📦 Loading system modules...");

    this.ContentIntegrity = require("./content-integrity-checker");
    this.AIRewriter = require("./ai-content-rewriter");
    this.ProductFetcher = require("./product-data-fetcher");
    this.Orchestrator = require("./product-intelligence-orchestrator");
    this.Conversion = require("./conversion-tracking-layer");
    this.Feeder = require("./feeder-management");

    this.log("✅ All modules loaded");
  },

  /**
   * MAIN BOOTSTRAP FUNCTION
   */
  async run() {

    this.loadSystem();

    this.log("🚀 Starting full system pipeline...");

    // STEP 1: Fetch raw product data (demo ASINs or feed input)
    const rawProducts = await this.ProductFetcher.fetchMultipleProducts([
      "B0933BVK6T",
      "B07W86T94V",
      "B08R5D8ZBD",
      "B08K7GHZ3V"
    ]);

    // STEP 2: Normalize integrity (NO placeholders allowed)
    let cleanProducts = this.ContentIntegrity.processProductList(rawProducts);

    // STEP 3: AI content rewrite (SEO + conversion optimization)
    cleanProducts = this.AIRewriter.processProductList(cleanProducts);

    // STEP 4: Run feeder system enrichment
    const enriched = await this.Feeder.run(cleanProducts);

    // STEP 5: Intelligence orchestration (ranking + scoring)
    const ranked = await this.Orchestrator.run(
      enriched,
      this.Feeder,
      "us"
    );

    // STEP 6: Apply conversion feedback loop
    const finalProducts = this.Conversion.enrichProducts(ranked);

    // STEP 7: Render final HTML output
    const html = this.renderHTML(finalProducts);

    // STEP 8: Save output file
    fs.writeFileSync("./dist/index.html", html);

    this.log("🎉 SYSTEM BUILD COMPLETE - index.html generated");
  },

  /**
   * FINAL HTML RENDER ENGINE
   */
  renderHTML: function(products) {

    this.log("🧱 Rendering HTML output...");

    const cards = products.map(p => `
      <a class="card" href="${p.affiliateUrl}">
        <div class="badge">${p.badge || "✔ PRODUCT"}</div>

        <img src="${p.image}" style="width:100%;border-radius:12px;" />

        <div class="title">${p.title}</div>

        <div class="desc">${p.description}</div>

        <div class="review">
          ${p.rating || 0} ⭐ | ${p.reviews || 0} reviews
        </div>
      </a>
    `).join("");

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>BrightLane System Output</title>
      <style>
        body { font-family: Arial; background:#0b0f1a; color:white; }
        .card { display:block; padding:15px; margin:10px; background:#111827; border-radius:12px; text-decoration:none; color:white; }
        .badge { font-size:12px; color:#00ff99; margin-bottom:8px; }
        .title { font-weight:bold; margin:8px 0; }
        .desc { font-size:13px; opacity:0.8; }
        .review { font-size:12px; opacity:0.6; margin-top:8px; }
      </style>
    </head>
    <body>
      <h1>🚀 Generated Product Intelligence System</h1>
      ${cards}
    </body>
    </html>
    `;
  }
};

MASTER_SYSTEM_RUNNER.run();
