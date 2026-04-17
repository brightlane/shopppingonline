const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "products-source.json");
const OUTPUT = path.join(__dirname, "products-final.json");

/**
 * 🔥 ULTIMATE FALLBACK IMAGE
 * Used ONLY if Amazon image is missing
 */
const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=Product+Image+Unavailable";

/**
 * 🧠 VALID IMAGE CHECK
 */
function isValidImage(img) {
  return typeof img === "string" && img.startsWith("http");
}

/**
 * 🧠 OPTIONAL: AUTO AMAZON IMAGE GENERATOR
 * (fallback pattern used when image missing)
 */
function generateAmazonImage(asin) {
  // Amazon images are not guaranteed predictable,
  // so we still use fallback if missing
  return FALLBACK_IMAGE;
}

/**
 * 📦 LOAD PRODUCTS
 */
function loadProducts() {
  if (!fs.existsSync(INPUT)) {
    console.error("❌ Missing products-source.json");
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(INPUT, "utf-8"));
}

/**
 * 🔧 CORE IMAGE GUARANTEE LOGIC
 */
function enforceImages(products) {
  return products.map(p => {
    let img = p.image;

    // CASE 1: valid image already exists
    if (isValidImage(img)) {
      return {
        ...p,
        image: img
      };
    }

    // CASE 2: missing or broken image
    // ALWAYS replace with fallback
    return {
      ...p,
      image: FALLBACK_IMAGE
    };
  });
}

/**
 * 🔐 EXTRA SAFETY: CLEAN BAD FIELDS
 */
function sanitize(products) {
  return products.filter(p => {
    return (
      p &&
      typeof p.asin === "string" &&
      typeof p.title === "string" &&
      p.title.length > 2
    );
  });
}

/**
 * 💾 SAVE FINAL FILE
 */
function save(data) {
  fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2));
  console.log("✅ products-final.json (IMAGE GUARANTEED) created");
}

/**
 * 🚀 RUN PIPELINE
 */
function run() {
  console.log("🧠 Running IMAGE ENFORCER...");

  const raw = loadProducts();

  const clean = sanitize(raw);

  const fixed = enforceImages(clean);

  save(fixed);

  console.log("🏁 ALL PRODUCTS NOW HAVE IMAGES (GUARANTEED)");
}

run();
