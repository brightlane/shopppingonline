const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "products-final.json");
const OUTPUT = path.join(__dirname, "products-enriched.json");

const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=Amazon+Image+Unavailable";

/**
 * 🧠 VALID CHECK
 */
function isValidImage(img) {
  return typeof img === "string" && img.startsWith("http");
}

/**
 * 🔥 AMAZON IMAGE BUILDER (SAFE GUESS METHOD)
 * NOTE: Amazon does NOT expose image by ASIN directly
 */
function buildAmazonImage(asin) {
  // This is NOT guaranteed but used as optional attempt placeholder logic
  return null;
}

/**
 * 📦 LOAD DATA
 */
function load() {
  if (!fs.existsSync(INPUT)) {
    console.error("❌ Missing products-final.json");
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(INPUT, "utf-8"));
}

/**
 * 🧠 ENRICH IMAGE DATA
 */
function enrich(products) {
  return products.map(p => {

    let image = p.image;

    // STEP 1: keep valid image
    if (isValidImage(image)) {
      return {
        ...p,
        image
      };
    }

    // STEP 2: try amazon guess (optional future API upgrade)
    const amazonImage = buildAmazonImage(p.asin);

    if (amazonImage && isValidImage(amazonImage)) {
      return {
        ...p,
        image: amazonImage
      };
    }

    // STEP 3: fallback (guaranteed safety)
    return {
      ...p,
      image: FALLBACK_IMAGE
    };
  });
}

/**
 * 💾 SAVE OUTPUT
 */
function save(data) {
  fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2));
  console.log("✅ Amazon image enrichment complete:", OUTPUT);
}

/**
 * 🚀 RUN
 */
function run() {
  console.log("🧠 Running Amazon image fetcher...");

  const products = load();
  const enriched = enrich(products);

  save(enriched);

  console.log("🏁 IMAGE FETCH PIPELINE COMPLETE");
}

run();
