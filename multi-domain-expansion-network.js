/**
 * multi-domain-expansion-network.js
 * AAC Multi-Site Autonomous Scaling Layer
 * Clones and deploys the full system across multiple domains
 */

const fs = require("fs");
const path = require("path");

// === CONFIG ===
const DOMAINS = [
  {
    name: "us-market",
    country: "us",
    amazonTag: "brightlane201-20"
  },
  {
    name: "de-market",
    country: "de",
    amazonTag: "brightlane-de-21"
  },
  {
    name: "uk-market",
    country: "uk",
    amazonTag: "brightlane-uk-22"
  },
  {
    name: "ca-market",
    country: "ca",
    amazonTag: "brightlane-ca-23"
  },
  {
    name: "au-market",
    country: "au",
    amazonTag: "brightlane-au-24"
  }
];

// === ENTRY POINT ===
function runMultiDomainExpansion() {
  console.log("🌍 Starting Multi-Domain Expansion Network...");

  DOMAINS.forEach(domain => {
    buildDomainInstance(domain);
  });

  console.log("✅ Multi-domain expansion complete");
}

// === BUILD DOMAIN INSTANCE ===
function buildDomainInstance(domain) {
  console.log(`🚀 Building domain: ${domain.name}`);

  const basePath = path.join(__dirname, "dist", domain.name);

  fs.mkdirSync(basePath, { recursive: true });

  // Create domain config
  const config = {
    domain: domain.name,
    country: domain.country,
    amazonTag: domain.amazonTag,
    timestamp: Date.now()
  };

  fs.writeFileSync(
    path.join(basePath, "config.json"),
    JSON.stringify(config, null, 2)
  );

  // Generate localized landing page
  const indexHTML = generateLandingPage(domain);

  fs.writeFileSync(
    path.join(basePath, "index.html"),
    indexHTML
  );

  // Generate robots + sitemap per domain
  fs.writeFileSync(
    path.join(basePath, "robots.txt"),
    generateRobots(domain)
  );

  fs.writeFileSync(
    path.join(basePath, "sitemap.xml"),
    generateSitemap(domain)
  );

  console.log(`✔ Domain built: ${domain.name}`);
}

// === LANDING PAGE GENERATOR ===
function generateLandingPage(domain) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Best Products in ${domain.country.toUpperCase()}</title>
  <meta name="description" content="Top affiliate products for ${domain.country} market">
</head>
<body>

<h1>Top Products for ${domain.country.toUpperCase()} Market</h1>

<p>Automatically optimized affiliate store for regional users.</p>

<a href="https://www.amazon.${getAmazonTLD(domain.country)}/?tag=${domain.amazonTag}">
  Shop on Amazon ${domain.country.toUpperCase()}
</a>

</body>
</html>
`;
}

// === ROBOTS FILE ===
function generateRobots(domain) {
  return `
User-agent: *
Allow: /

Sitemap: https://${domain.name}/sitemap.xml
`;
}

// === SITEMAP GENERATOR ===
function generateSitemap(domain) {
  return `
<?xml version="1.0" encoding="UTF-8"?>
<urlset>

  <url>
    <loc>https://${domain.name}/</loc>
    <priority>1.0</priority>
  </url>

</urlset>
`;
}

// === AMAZON TLD MAPPER ===
function getAmazonTLD(country) {
  const map = {
    us: "com",
    uk: "co.uk",
    de: "de",
    ca: "ca",
    au: "com.au"
  };

  return map[country] || "com";
}

// === EXPORTS ===
module.exports = {
  runMultiDomainExpansion
};

// === AUTO RUN ===
if (require.main === module) {
  runMultiDomainExpansion();
}
