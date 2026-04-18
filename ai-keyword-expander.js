const fs = require("fs");
const path = require("path");

const OUTPUT = path.join(__dirname, "expanded-keywords.json");

/**
 * Base product seeds (your niches)
 */
const SEEDS = [
  "vacuum cleaner",
  "coffee machine",
  "ring light",
  "air fryer",
  "power bank",
  "espresso machine",
  "solar generator",
  "smart watch",
  "laptop stand",
  "portable blender"
];

/**
 * Intent layers (this is where SEO power comes from)
 */
const INTENTS = {
  buy: [
    "buy", "best", "top", "cheap", "affordable", "premium", "2026"
  ],
  comparison: [
    "vs", "versus", "alternative", "compared to", "or"
  ],
  problem: [
    "not working", "fix", "why", "how to use", "review"
  ],
  use_case: [
    "for home", "for car", "for travel", "for office", "for small apartment"
  ]
};

/**
 * Quality scoring model (important for filtering junk)
 */
function scoreKeyword(keyword) {
  let score = 0.4;

  const lower = keyword.toLowerCase();

  if (lower.includes("best")) score += 0.2;
  if (lower.includes("vs")) score += 0.25;
  if (lower.includes("2026")) score += 0.1;
  if (lower.includes("cheap") || lower.includes("affordable")) score += 0.15;
  if (lower.includes("for")) score += 0.1;

  if (keyword.split(" ").length >= 5) score += 0.1;

  return Math.min(1, score);
}

/**
 * Generate structured expansions (NOT random permutations)
 */
function expand(seed) {
  const results = [];

  for (const type in INTENTS) {
    for (const phrase of INTENTS[type]) {
      const keyword = `${phrase} ${seed}`;

      results.push({
        keyword,
        seed,
        intent: type,
        score: scoreKeyword(keyword)
      });
    }
  }

  return results;
}

/**
 * Build 1000+ expansion pool intelligently
 */
function generate() {
  const all = [];

  for (const seed of SEEDS) {
    const base = expand(seed);

    // multiply intelligently with modifiers
    const enriched = base.flatMap(item => {
      return [
        item,
        {
          keyword: `${item.keyword} 2026`,
          seed,
          intent: item.intent,
          score: scoreKeyword(item.keyword + " 2026")
        },
        {
          keyword: `${item.keyword} amazon`,
          seed,
          intent: item.intent,
          score: scoreKeyword(item.keyword + " amazon")
        },
        {
          keyword: `${item.keyword} top rated`,
          seed,
          intent: item.intent,
          score: scoreKeyword(item.keyword + " top rated")
        }
      ];
    });

    all.push(...enriched);
  }

  return all;
}

/**
 * Deduplicate aggressively
 */
function dedupe(arr) {
  const seen = new Set();

  return arr.filter(item => {
    if (seen.has(item.keyword)) return false;
    seen.add(item.keyword);
    return true;
  });
}

/**
 * Filter ONLY monetizable keywords
 */
function filterHighValue(arr) {
  return arr.filter(k =>
    k.score >= 0.60 &&
    k.keyword.split(" ").length >= 3
  );
}

/**
 * Main execution
 */
function run() {
  console.log("AI Keyword Expansion Engine Running...");

  let data = generate();

  console.log("Raw keywords:", data.length);

  data = dedupe(data);

  console.log("After dedupe:", data.length);

  data = filterHighValue(data);

  console.log("After filtering:", data.length);

  // sort best first
  data.sort((a, b) => b.score - a.score);

  fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2));

  console.log("Expansion complete:");
  console.log("→ Output:", OUTPUT);
  console.log("→ Top keyword:", data[0]?.keyword);
  console.log("→ Total usable:", data.length);
}

run();
