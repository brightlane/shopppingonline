const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "products-source.json");

const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=No+Image";

/**
 * 🧠 VALID ASIN CHECK
 */
function isValidASIN(asin) {
  return typeof asin === "string" && /^[A-Z0-9]{8,12}$/.test(asin);
}

/**
 * 🖼 SAFE IMAGE
 */
function safeImage(img) {
  if (!img || typeof img !== "string") return FALLBACK_IMAGE;
  if (img.includes("undefined")) return FALLBACK_IMAGE;
  return img;
}

/**
 * 🧱 SANITIZE PRODUCT
 */
function sanitizeProduct(p) {

  return {
    ...p,

    asin: isValidASIN(p.asin) ? p.asin : null,

    image: safeImage(p.image),

    category: p.category || "uncategorized",

    rating: p.rating || "4.5",

    price: p.price || "N/A",

    title: p.title || "Untitled Product"
  };
}

/**
 * 🚀 RUN SANITIZER
 */
function run() {

  const raw = JSON.parse(fs.readFileSync(FILE, "utf-8"));

  const cleaned = raw
    .map(sanitizeProduct)
    .filter(p => p.asin !== null); // remove broken products

  fs.writeFileSync(FILE, JSON.stringify(cleaned, null, 2));

  console.log("✅ PRODUCT SANITIZATION COMPLETE");
  console.log("📦 Valid products:", cleaned.length);
}

run();
