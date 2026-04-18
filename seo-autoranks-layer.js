/**
 * SEO AutoRank Layer
 * Builds keyword priority + CTR optimization signals
 * Works with: generate-seo-pages.js / internal-linker.js / auto-rank.js
 */

const fs = require("fs");
const path = require("path");

// Load keyword dataset
const KEYWORDS_PATH = path.join(__dirname, "seo-keywords.json");
const OUTPUT_PATH = path.join(__dirname, "seo-keywords-ranked.json");

/**
 * Normalize score safely
 */
function clamp(num, min = 0, max = 1) {
  return Math.max(min, Math.min(max, num));
}

/**
 * Estimate keyword difficulty (simple heuristic model)
 */
function estimateCompetition(keyword) {
  const hardTerms = [
    "best", "review", "top", "vs", "comparison", "cheap",
    "2026", "buy", "amazon", "wireless", "pro"
  ];

  let score = 0.3;

  hardTerms.forEach(term => {
    if (keyword.toLowerCase().includes(term)) {
      score += 0.08;
    }
  });

  // longer tail keywords = easier ranking
  if (keyword.split(" ").length >= 4) score -= 0.1;

  return clamp(score);
}

/**
 * Estimate Amazon demand potential
 */
function estimateDemand(keyword) {
  const demandSignals = {
    "vacuum": 0.85,
    "coffee": 0.88,
    "ring light": 0.83,
    "air fryer": 0.91,
    "power bank": 0.80,
    "kindle": 0.87,
    "stanley": 0.86,
    "acne": 0.78
  };

  let score = 0.5;

  Object.keys(demandSignals).forEach(key => {
    if (keyword.toLowerCase().includes(key)) {
      score = Math.max(score, demandSignals[key]);
    }
  });

  return clamp(score);
}

/**
 * CTR potential model (based on emotional + commercial intent)
 */
function estimateCTR(keyword) {
  let score = 0.4;

  const highCtrTriggers = [
    "vs", "best", "top", "winner", "cheap", "vs", "alternative"
  ];

  highCtrTriggers.forEach(term => {
    if (keyword.toLowerCase().includes(term)) {
      score += 0.12;
    }
  });

  if (keyword.includes("2026")) score += 0.08;
  if (keyword.split(" ").length >= 5) score += 0.05;

  return clamp(score);
}

/**
 * Priority scoring engine
 */
function calculatePriority({ keyword }) {
  const competition = estimateCompetition(keyword);
  const demand = estimateDemand(keyword);
  const ctr = estimateCTR(keyword);

  const priorityScore =
    (demand * 0.45) +
    (ctr * 0.35) -
    (competition * 0.25);

  return {
    keyword,
    competition: Number(competition.toFixed(3)),
    amazonDemand: Number(demand.toFixed(3)),
    ctrPotential: Number(ctr.toFixed(3)),
    priorityScore: Number(clamp(priorityScore).toFixed(3))
  };
}

/**
 * Assign page tier for generation system
 */
function assignTier(score) {
  if (score >= 0.80) return "HUB_PAGE";
  if (score >= 0.65) return "BOOST_PAGE";
  if (score >= 0.45) return "STANDARD_PAGE";
  return "LOW_PRIORITY";
}

/**
 * Generate internal link suggestions
 */
function generateLinks(keyword) {
  const base = keyword.toLowerCase();

  const links = [];

  if (base.includes("vacuum")) {
    links.push("/vacuum-hub.html");
    links.push("/best-vacuum-cleaners-en.html");
  }

  if (base.includes("coffee")) {
    links.push("/coffee-hub.html");
    links.push("/best-coffee-makers-en.html");
  }

  if (base.includes("ring")) {
    links.push("/ring_light-hub.html");
    links.push("/best-ring_light-en.html");
  }

  if (base.includes("stanley")) {
    links.push("/stanley-hub.html");
  }

  return links;
}

/**
 * Main execution
 */
function run() {
  const raw = JSON.parse(fs.readFileSync(KEYWORDS_PATH, "utf-8"));

  const ranked = raw.map(item => {
    const base = calculatePriority(item);
    const tier = assignTier(base.priorityScore);
    const links = generateLinks(item.keyword);

    return {
      ...base,
      tier,
      internalLinks: links
    };
  });

  // Sort highest priority first
  ranked.sort((a, b) => b.priorityScore - a.priorityScore);

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(ranked, null, 2));

  console.log("SEO AutoRank complete:");
  console.log(`→ Keywords processed: ${ranked.length}`);
  console.log(`→ Top keyword: ${ranked[0]?.keyword}`);
  console.log(`→ Output: ${OUTPUT_PATH}`);
}

run();
