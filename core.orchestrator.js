/**
 * Autonomous Affiliate Intelligence System (AAIS)
 * core.orchestrator.js
 * Main execution brain for global SEO + affiliate automation
 */

const fs = require("fs");
const path = require("path");

// ===============================
// CONFIG
// ===============================

const CONFIG = {
  countries: ["us", "uk", "de", "fr", "es", "it", "ca", "au", "in", "jp"],
  defaultTag: "brightlane201-20",
  outputDir: "./dist",
  pagesDir: "./pages",
  logFile: "./log.txt"
};

// ===============================
// AMAZON ROUTING BRAIN
// ===============================

const AMAZON_DOMAINS = {
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
};

function getAmazonDomain(country) {
  return AMAZON_DOMAINS[country] || "amazon.com";
}

function buildAffiliateLink(asin, country) {
  const domain = getAmazonDomain(country);
  const tag = CONFIG.defaultTag;

  return `https://${domain}/dp/${asin}?tag=${tag}`;
}

// ===============================
// LOGGING SYSTEM
// ===============================

function log(message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(CONFIG.logFile, line);
  console.log(message);
}

// ===============================
// SEO HEALTH CHECK
// ===============================

function runHealthCheck(page) {
  const issues = [];

  if (!page.includes("<title>")) issues.push("Missing title");
  if (!page.includes("amazon")) issues.push("No affiliate links detected");
  if (page.length < 500) issues.push("Thin content");

  return {
    healthy: issues.length === 0,
    issues
  };
}

// ===============================
// PAGE GENERATION ENGINE
// ===============================

function generatePage({ keyword, asin, country }) {
  const affiliateLink = buildAffiliateLink(asin, country);

  return `
<!DOCTYPE html>
<html>
<head>
  <title>${keyword} - Best Deals</title>
  <meta name="description" content="Top ${keyword} deals and comparisons">
</head>
<body>

<h1>${keyword}</h1>

<p>Best global deal for ${keyword}.</p>

<a href="${affiliateLink}" target="_blank">
  Buy on Amazon (${country.toUpperCase()})
</a>

</body>
</html>
`;
}

// ===============================
// GLOBAL EXPANSION ENGINE
// ===============================

function expandAcrossCountries(product) {
  const pages = [];

  for (const country of CONFIG.countries) {
    const page = generatePage({
      keyword: product.keyword,
      asin: product.asin,
      country
    });

    const filePath = path.join(
      CONFIG.outputDir,
      `${product.keyword}-${country}.html`
    );

    fs.writeFileSync(filePath, page);
    pages.push(filePath);

    log(`Generated: ${filePath}`);
  }

  return pages;
}

// ===============================
// SELF-HEALING ENGINE
// ===============================

function selfHeal(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const result = runHealthCheck(content);

  if (!result.healthy) {
    log(`Fixing page: ${filePath} | Issues: ${result.issues.join(", ")}`);

    let fixed = content;

    if (!content.includes("<title>")) {
      fixed = fixed.replace("<head>", "<head><title>Auto Fixed Page</title>");
    }

    fs.writeFileSync(filePath, fixed);
  }
}

// ===============================
// MAIN ORCHESTRATOR
// ===============================

async function run() {
  log("🚀 AAIS Orchestrator Starting...");

  const products = [
    { keyword: "coffee machine", asin: "B07XYZ1234" },
    { keyword: "vacuum cleaner", asin: "B08ABC5678" },
    { keyword: "ring light", asin: "B09LMN9999" }
  ];

  for (const product of products) {
    log(`Processing product: ${product.keyword}`);

    const pages = expandAcrossCountries(product);

    for (const page of pages) {
      selfHeal(page);
    }
  }

  log("✅ AAIS Orchestrator Completed");
}

run();
