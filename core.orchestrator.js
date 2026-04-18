/**
 * =====================================================
 * AAIS - AUTONOMOUS AFFILIATE INTELLIGENCE SYSTEM
 * CORE ORCHESTRATOR (FULL ENTRY FILE)
 * =====================================================
 *
 * This file controls:
 * - global SEO page generation
 * - Amazon affiliate routing (multi-country)
 * - product expansion system
 * - self-healing SEO checks
 * - GitHub Actions compatibility
 * - feeder system hooks (RSS/social/amazon trends)
 */

const fs = require("fs");
const path = require("path");

// =====================================================
// CONFIGURATION
// =====================================================

const CONFIG = {
  siteName: "BrightLane AAIS",
  outputDir: path.join(__dirname, "dist"),
  logFile: path.join(__dirname, "log.txt"),

  affiliateTag: "brightlane201-20",

  countries: ["us", "uk", "de", "fr", "es", "it", "ca", "au", "in", "jp"],

  amazonDomains: {
    us: "amazon.com",
    uk: "amazon.co.uk",
    de: "amazon.de",
    fr: "amazon.fr",
    es: "amazon.es",
    it: "amazon.it",
    ca: "amazon.ca",
    au: "amazon.com.au",
    in: "amazon.in",
    jp: "amazon.co.jp"
  }
};

// =====================================================
// FEEDER SYSTEM (HOOKS ONLY)
// =====================================================

const FEEDERS = {
  rss: [],
  social: [],
  amazon: []
};

// =====================================================
// LOGGING
// =====================================================

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(CONFIG.logFile, line);
  console.log(msg);
}

// =====================================================
// AMAZON ROUTING BRAIN
// =====================================================

function getAmazonDomain(country) {
  return CONFIG.amazonDomains[country] || "amazon.com";
}

function buildAffiliateUrl({ asin, country }) {
  const domain = getAmazonDomain(country);
  return `https://${domain}/dp/${asin}?tag=${CONFIG.affiliateTag}`;
}

// =====================================================
// SEO PAGE GENERATOR
// =====================================================

function generatePage({ keyword, asin, country }) {
  const url = buildAffiliateUrl({ asin, country });

  return `<!DOCTYPE html>
<html lang="${country}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${keyword} - Best Deals (${country.toUpperCase()})</title>
  <meta name="description" content="Best ${keyword} deals, reviews, and comparisons in ${country.toUpperCase()}">

  <link rel="canonical" href="${url}">
</head>

<body>

  <header>
    <h1>${keyword}</h1>
    <p>Global affiliate optimized page</p>
  </header>

  <main>
    <h2>Top Recommendation</h2>

    <p>We found the best option for ${keyword} in ${country.toUpperCase()}.</p>

    <a href="${url}" target="_blank" rel="nofollow sponsored">
      👉 Buy on Amazon (${country.toUpperCase()})
    </a>
  </main>

</body>
</html>`;
}

// =====================================================
// FILE WRITER
// =====================================================

function writeFile(filename, content) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });

  const filePath = path.join(CONFIG.outputDir, filename);
  fs.writeFileSync(filePath, content);

  log(`Generated: ${filePath}`);
  return filePath;
}

// =====================================================
// GLOBAL EXPANSION ENGINE
// =====================================================

function expandProduct(product) {
  const files = [];

  for (const country of CONFIG.countries) {
    const html = generatePage({
      keyword: product.keyword,
      asin: product.asin,
      country
    });

    const filename = `${product.keyword.replace(/\s+/g, "-")}-${country}.html`;

    files.push(writeFile(filename, html));
  }

  return files;
}

// =====================================================
// SELF-HEALING SEO ENGINE
// =====================================================

function selfHeal(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");

  let fixed = content;
  let changed = false;

  if (!content.includes("<title>")) {
    fixed = fixed.replace("<head>", "<head><title>Auto Fixed</title>");
    changed = true;
  }

  if (!content.includes("amazon.")) {
    fixed += "\n<!-- AUTO FIX: missing affiliate link detected -->";
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, fixed);
    log(`Self-healed: ${filePath}`);
  }
}

// =====================================================
// PRODUCT DATABASE (EXPANSION SEED)
// =====================================================

const PRODUCTS = [
  { keyword: "coffee machine", asin: "B07XYZ1234" },
  { keyword: "vacuum cleaner", asin: "B08ABC5678" },
  { keyword: "ring light", asin: "B09LMN9999" },
  { keyword: "air fryer", asin: "B0AIR12345" },
  { keyword: "portable power bank", asin: "B0PWR98765" }
];

// =====================================================
// MAIN ORCHESTRATOR (CORE BRAIN)
// =====================================================

function run() {
  log("======================================");
  log("🚀 AAIS ORCHESTRATOR STARTED");
  log("======================================");

  log("Feeder system initialized (RSS / Social / Amazon hooks ready)");

  for (const product of PRODUCTS) {
    log(`Processing product: ${product.keyword}`);

    const files = expandProduct(product);

    for (const file of files) {
      selfHeal(file);
    }
  }

  log("======================================");
  log("✅ AAIS ORCHESTRATOR COMPLETE");
  log("======================================");
}

// =====================================================
// EXECUTION ENTRY POINT
// =====================================================

run();

// =====================================================
// EXPORTS (GitHub Actions / modular scaling)
// =====================================================

module.exports = {
  run,
  expandProduct,
  buildAffiliateUrl,
  getAmazonDomain
};
/**
 * core.orchestrator.js
 * BrightLane / Global Affiliate Engine Core
 */

const fs = require("fs");
const path = require("path");

// ===== CONFIG LOADER =====
const CONFIG = require("./config/workflow.config.json");

// ===== MODULE IMPORTS (future layers) =====
const seoEngine = require("./scripts/seo.js");
const keywordEngine = require("./scripts/keyword-generator.js");
const articleEngine = require("./scripts/article-generator.js");

// ===== AFFILIATE ROUTER =====
const AFFILIATE_TAG = "brightlane201-20";

const AMAZON_DOMAINS = {
  US: "amazon.com",
  DE: "amazon.de",
  UK: "amazon.co.uk",
  FR: "amazon.fr",
  ES: "amazon.es",
  IT: "amazon.it",
  CA: "amazon.ca",
  JP: "amazon.co.jp",
  AU: "amazon.com.au",
  IN: "amazon.in"
};

// detect marketplace
function resolveAmazonDomain(country) {
  return AMAZON_DOMAINS[country?.toUpperCase()] || "amazon.com";
}

// build affiliate URL
function buildAffiliateUrl(asin, country = "US") {
  const domain = resolveAmazonDomain(country);
  return `https://www.${domain}/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

// ===== PRODUCT ROUTING BRAIN =====
function routeProduct(product, country) {
  return {
    ...product,
    url: buildAffiliateUrl(product.asin, country),
    country
  };
}

// ===== SEO GENERATION PIPELINE =====
async function generateSEO(product, country) {
  const enriched = routeProduct(product, country);

  const article = await articleEngine.generate({
    product: enriched,
    country
  });

  const keywords = keywordEngine.generate(product.title);

  return {
    product: enriched,
    keywords,
    article
  };
}

// ===== PAGE BUILDER =====
function writePage(fileName, content) {
  const outPath = path.join(__dirname, "pages", fileName);
  fs.writeFileSync(outPath, content, "utf-8");
}

// ===== AUTONOMOUS RUNNER =====
async function runEngine(products, countries = ["US"]) {
  console.log("🚀 Orchestrator started...");

  for (const country of countries) {
    for (const product of products) {
      const seoPackage = await generateSEO(product, country);

      const html = seoEngine.renderPage(seoPackage);

      const fileName = `${product.slug}-${country.toLowerCase()}.html`;

      writePage(fileName, html);

      console.log(`✔ Generated: ${fileName}`);
    }
  }

  console.log("✅ Orchestrator complete.");
}

// ===== EXPORT =====
module.exports = {
  runEngine,
  buildAffiliateUrl,
  routeProduct,
  resolveAmazonDomain
};
