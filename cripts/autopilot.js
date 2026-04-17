const { runCache } = require("./cache-manager");
const { runPAAPI } = require("./paapi-fetch");
const { buildSEO } = require("./seo-builder");
const { buildHubs } = require("./hub-builder");

async function run() {
  console.log("🚀 AUTOPILOT STARTING...");

  // 1. CACHE FIRST (NO API SPAM)
  await runCache();

  // 2. ENRICH DATA (PA-API if needed)
  await runPAAPI();

  // 3. BUILD SEO PAGES
  await buildSEO();

  // 4. BUILD HUB PAGES
  await buildHubs();

  console.log("🏁 AUTOPILOT COMPLETE");
}

run();
