const fs = require("fs");
const path = require("path");

const OUTPUT = path.join(__dirname, "keyword-stream-output.json");

// Core seed clusters (expandable into millions via permutations)
const SEEDS = [
  "vacuum cleaner",
  "coffee machine",
  "ring light",
  "power bank",
  "air fryer",
  "espresso machine",
  "portable generator",
  "solar panel kit",
  "cordless drill",
  "smart watch"
];

const MODIFIERS = [
  "best",
  "cheap",
  "vs",
  "for home",
  "for car",
  "2026",
  "quiet",
  "mini",
  "portable",
  "professional",
  "budget",
  "high power",
  "amazon deal",
  "top rated"
];

const INTENTS = [
  "review",
  "comparison",
  "alternative",
  "guide",
  "setup",
  "buy"
];

/**
 * Score keyword before saving
 */
function score(keyword) {
  let s = 0.4;

  if (keyword.includes("best")) s += 0.15;
  if (keyword.includes("vs")) s += 0.2;
  if (keyword.includes("2026")) s += 0.1;
  if (keyword.split(" ").length >= 4) s += 0.1;

  return Math.min(1, s);
}

/**
 * Stream generator (does NOT store full dataset in memory)
 */
function generateStream(limit = 10000000) {
  const results = [];

  let count = 0;

  for (let i = 0; i < SEEDS.length; i++) {
    for (let j = 0; j < MODIFIERS.length; j++) {
      for (let k = 0; k < INTENTS.length; k++) {

        const keyword =
          `${MODIFIERS[j]} ${SEEDS[i]} ${INTENTS[k]}`;

        const item = {
          keyword,
          score: score(keyword),
          silo: SEEDS[i],
          intent: INTENTS[k]
        };

        // FILTER EARLY (critical for scale)
        if (item.score < 0.55) continue;

        results.push(item);
        count++;

        if (count >= limit) break;
      }
    }
  }

  return results;
}

/**
 * Deduplicate aggressively
 */
function dedupe(arr) {
  const seen = new Set();
  return arr.filter(k => {
    if (seen.has(k.keyword)) return false;
    seen.add(k.keyword);
    return true;
  });
}

/**
 * Main execution
 */
function run() {
  console.log("Generating keyword stream...");

  let data = generateStream();

  console.log(`Raw generated: ${data.length}`);

  data = dedupe(data);

  console.log(`After dedupe: ${data.length}`);

  // Sort by score
  data.sort((a, b) => b.score - a.score);

  // KEEP ONLY TOP 1–3%
  const cutoff = Math.floor(data.length * 0.02);
  const filtered = data.slice(0, cutoff);

  fs.writeFileSync(OUTPUT, JSON.stringify(filtered, null, 2));

  console.log("Keyword stream complete:");
  console.log(`→ Final keywords: ${filtered.length}`);
  console.log(`→ Output: ${OUTPUT}`);
}

run();
