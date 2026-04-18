/**
 * core.orchestrator.js
 * AAC Global Control Orchestrator
 * Single brain that runs all system layers in correct order
 */

const { buildGlobalUniverse, prioritizeUniverse } = require("./scripts/global-expansion-engine");
const { applyRouting } = require("./scripts/affiliate-routing-brain");
const { enrichWithImages } = require("./scripts/image-ctr-engine");
const { runLearningLoop } = require("./scripts/self-learning-seo-loop");

const fs = require("fs");
const path = require("path");

// === CONFIG ===
const CONFIG = {
  country: "us",
  maxProducts: 1000,
  outputDir: path.join(__dirname, "dist")
};

// === ENTRY POINT ===
async function runOrchestrator() {
  console.log("🚀 AAC Orchestrator Starting...");

  // 1. LOAD BASE DATA (placeholder seed products)
  const baseProducts = loadSeedProducts();

  // 2. EXPAND GLOBAL PRODUCT UNIVERSE
  let universe = buildGlobalUniverse(baseProducts);

  console.log(`🌍 Universe size: ${universe.length}`);

  // 3. PRIORITIZE PRODUCTS
  universe = prioritizeUniverse(universe);

  // 4. LIMIT TOP SET
  universe = universe.slice(0, CONFIG.maxProducts);

  // 5. APPLY AFFILIATE ROUTING
  universe = applyRouting(universe, CONFIG.country);

  // 6. APPLY IMAGE CTR ENGINE
  universe = enrichWithImages(universe);

  // 7. GENERATE PAGES
  generatePages(universe);

  // 8. RUN SELF-LEARNING LOOP
  runLearningLoop();

  console.log("✅ Orchestrator complete");
}

// === SEED DATA ===
function loadSeedProducts() {
  return [
    {
      asin: "B000TEST1",
      title: "Smart Vacuum Cleaner",
      category: "vacuum cleaners",
      score: 3
    },
    {
      asin: "B000TEST2",
      title: "Premium Coffee Maker",
      category: "coffee makers",
      score: 4
    },
    {
      asin: "B000TEST3",
      title: "Portable Power Station",
      category: "portable power",
      score: 5
    }
  ];
}

// === PAGE GENERATION ENGINE ===
function generatePages(products) {
  const dir = CONFIG.outputDir;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  products.forEach((p, index) => {
    const html = buildHTMLPage(p, index);

    const fileName = `${slugify(p.title)}.html`;
    const filePath = path.join(dir, fileName);

    fs.writeFileSync(filePath, html, "utf8");
  });

  console.log(`📄 Generated ${products.length} pages`);
}

// === HTML BUILDER ===
function buildHTMLPage(product, index) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>${product.title}</title>
  <meta name="description" content="Best ${product.category} review and comparison">
</head>
<body>

<h1>${product.title}</h1>

<img src="${product.image}" alt="${product.title}" />

<p>Category: ${product.category}</p>

<a href="${product.affiliateUrl}" target="_blank">
  View on Amazon
</a>

<!-- AAC metadata -->
<script>
  window.AAC = {
    score: ${product.score},
    imageVariant: "${product.imageVariant}"
  };
</script>

</body>
</html>
`;
}

// === SLUGIFY ===
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// === RUN ===
if (require.main === module) {
  runOrchestrator();
}

module.exports = {
  runOrchestrator
};
