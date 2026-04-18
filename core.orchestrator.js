/**
 * core.orchestrator.js
 * Affiliate Autonomous Core (AAC) – Master System Controller
 */

const fs = require("fs");
const path = require("path");

// === CONFIG LOADER ===
const config = require("./config/config.js");

// === MODULE IMPORTS (future layers) ===
const productEngine = require("./scripts/auto-product-feed.js");
const seoEngine = require("./scripts/seo.js");
const keywordEngine = require("./scripts/keyword-generator.js");
const imageEngine = require("./scripts/amazon-image-fetcher.js");
const rankEngine = require("./scripts/trending-engine.js");

// === GLOBAL STATE ===
let SYSTEM_STATE = {
  lastRun: null,
  productsProcessed: 0,
  pagesGenerated: 0,
  errors: []
};

// === AMAZON ROUTING BRAIN ===
function resolveAmazonDomain(country) {
  const map = {
    us: "amazon.com",
    de: "amazon.de",
    uk: "amazon.co.uk",
    ca: "amazon.ca",
    fr: "amazon.fr",
    es: "amazon.es",
    it: "amazon.it",
    jp: "amazon.co.jp",
    au: "amazon.com.au",
    nl: "amazon.nl"
  };

  return map[country] || "amazon.com";
}

function buildAffiliateUrl(asin, country = "us", tag = config?.affiliateTag || "brightlane201-20") {
  const domain = resolveAmazonDomain(country);
  return `https://${domain}/dp/${asin}?tag=${tag}`;
}

// === CORE PIPELINE ===
async function runPipeline() {
  console.log("🚀 AAC Orchestrator Starting...");

  try {
    // 1. Load product data
    const products = productEngine.loadProducts();

    // 2. Expand keywords (AI layer)
    const expandedKeywords = keywordEngine.expand(products);

    // 3. Rank products (CTR + SEO scoring)
    const ranked = rankEngine.rank(products, expandedKeywords);

    // 4. Generate images (future CTR layer)
    const enriched = imageEngine.enrichWithImages(ranked);

    // 5. Generate SEO pages
    const pages = seoEngine.generatePages(enriched);

    // 6. Write output
    writePages(pages);

    SYSTEM_STATE.lastRun = new Date().toISOString();
    SYSTEM_STATE.productsProcessed = products.length;
    SYSTEM_STATE.pagesGenerated = pages.length;

    console.log("✅ Pipeline Complete:", SYSTEM_STATE);
  } catch (err) {
    SYSTEM_STATE.errors.push(err.message);
    console.error("❌ Pipeline Error:", err);
  }
}

// === PAGE WRITER ===
function writePages(pages) {
  const outputDir = path.join(__dirname, "dist");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  pages.forEach(page => {
    const filePath = path.join(outputDir, page.slug + ".html");
    fs.writeFileSync(filePath, page.html, "utf8");
  });
}

// === EXPORTS ===
module.exports = {
  runPipeline,
  buildAffiliateUrl,
  resolveAmazonDomain,
  SYSTEM_STATE
};

// === AUTO RUN (GitHub Actions safe) ===
if (require.main === module) {
  runPipeline();
}
