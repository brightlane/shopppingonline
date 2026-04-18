/**
 * ctr-optimization-engine.js
 * BrightLane CTR Optimization & Variant Selection Layer
 */

const fs = require("fs");
const path = require("path");

// ============================
// CONFIG
// ============================
const CONFIG = {
  pagesDir: path.join(__dirname, "pages"),
  statsFile: path.join(__dirname, "ctr-stats.json")
};

// ============================
// LOAD OR INIT STATS DB
// ============================
function loadStats() {
  if (!fs.existsSync(CONFIG.statsFile)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(CONFIG.statsFile, "utf-8"));
}

// ============================
// SAVE STATS
// ============================
function saveStats(data) {
  fs.writeFileSync(
    CONFIG.statsFile,
    JSON.stringify(data, null, 2)
  );
}

// ============================
// TITLE VARIANTS (CTR TESTING)
// ============================
function generateTitleVariants(base) {
  return [
    `🔥 Best ${base} (2026 Guide)`,
    `Top Rated ${base} You Should Buy`,
    `${base} - Ultimate Comparison 2026`,
    `Best ${base} Ranked (Expert Picks)`
  ];
}

// ============================
// IMAGE VARIANTS (placeholder logic)
// ============================
function selectImageVariant(product) {
  const variants = [
    "hero-default.jpg",
    "hero-lifestyle.jpg",
    "hero-closeup.jpg",
    "hero-unboxing.jpg"
  ];

  const index = Math.floor(Math.random() * variants.length);
  return variants[index];
}

// ============================
// SIMULATED CTR SCORING
// (replace with real analytics later)
// ============================
function simulateCTR() {
  return Math.random(); // 0–1
}

// ============================
// OPTIMIZE PAGE
// ============================
function optimizePage(content, pageName, stats) {
  const variants = generateTitleVariants(pageName);

  let bestTitle = variants[0];
  let bestScore = 0;

  // evaluate stored performance
  variants.forEach(title => {
    const score = stats[title] || simulateCTR();

    if (score > bestScore) {
      bestScore = score;
      bestTitle = title;
    }
  });

  const image = selectImageVariant(pageName);

  const updated = content
    .replace(/<title>.*?<\/title>/i, `<title>${bestTitle}</title>`)
    .replace(
      /data-hero-image=".*?"/i,
      `data-hero-image="${image}"`
    );

  return {
    updated,
    bestTitle,
    bestScore,
    image
  };
}

// ============================
// PAGE PROCESSOR
// ============================
function runCTROptimizer() {
  console.log("🎯 Running CTR Optimization Engine...");

  const stats = loadStats();

  const files = fs.readdirSync(CONFIG.pagesDir);

  const updatedStats = { ...stats };

  files.forEach(file => {
    if (!file.endsWith(".html")) return;

    const filePath = path.join(CONFIG.pagesDir, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const pageName = file.replace(".html", "");

    const result = optimizePage(content, pageName, stats);

    fs.writeFileSync(filePath, result.updated, "utf-8");

    // store performance feedback loop
    updatedStats[result.bestTitle] = result.bestScore;

    console.log(
      `✔ Optimized: ${file} | Title: ${result.bestTitle}`
    );
  });

  saveStats(updatedStats);

  console.log("✅ CTR optimization complete.");
}

// ============================
// AUTO RUN
// ============================
if (require.main === module) {
  runCTROptimizer();
}

// ============================
// EXPORTS
// ============================
module.exports = {
  runCTROptimizer,
  generateTitleVariants,
  selectImageVariant
};
