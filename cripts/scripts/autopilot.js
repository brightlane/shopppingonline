const fs = require("fs");
const path = require("path");

const { runCache } = require("./cache");
const { sort } = require("./ranker");
const { buildSEO } = require("./seo");

async function run() {
  console.log("🚀 AUTOPILOT v2 START");

  const source = JSON.parse(
    fs.readFileSync("./data/products-source.json", "utf-8")
  );

  // 1. CACHE + PA-API
  const enriched = await runCache(source);

  // 2. RANKING
  const ranked = sort(enriched);

  // 3. SEO BUILD
  buildSEO(ranked);

  console.log("🏁 AUTOPILOT v2 COMPLETE");
}

run();
