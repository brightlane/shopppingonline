const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "products-source.json");

/**
 * 🧠 REPLACE THIS WITH REAL VERIFIED PRODUCTS
 * These ASINs are VALID FORMAT (example set)
 * You MUST update over time with real ones
 */
const CLEAN_PRODUCTS = [
  {
    title: "iRobot Roomba j9+",
    asin: "B0C4Z9KZ8Y",
    category: "vacuum cleaners",
    price: 899,
    rating: 4.7,
    image: "https://m.media-amazon.com/images/I/81+M1b3Yk+L._AC_SL1500_.jpg"
  },
  {
    title: "Shark PowerDetect Cordless",
    asin: "B0C2LQGZ6K",
    category: "vacuum cleaners",
    price: 450,
    rating: 4.6,
    image: "https://m.media-amazon.com/images/I/71YkQzZQ7FL._AC_SL1500_.jpg"
  },
  {
    title: "Dyson V15 Detect",
    asin: "B09J8Z7R5K",
    category: "vacuum cleaners",
    price: 749,
    rating: 4.7,
    image: "https://m.media-amazon.com/images/I/71gY2qK6h2L._AC_SL1500_.jpg"
  },
  {
    title: "Technivorm Moccamaster KBGV",
    asin: "B01N6N2ARX",
    category: "coffee makers",
    price: 359,
    rating: 4.8,
    image: "https://m.media-amazon.com/images/I/71lE9x0R6XL._AC_SL1500_.jpg"
  },
  {
    title: "UBeesize Ring Light",
    asin: "B07QFV72LK",
    category: "ring lights for phone",
    price: 38,
    rating: 4.6,
    image: "https://m.media-amazon.com/images/I/61rX7z9p9PL._AC_SL1500_.jpg"
  }
];

/**
 * 🧠 VALIDATE ASIN FORMAT
 */
function isValidASIN(asin) {
  return typeof asin === "string" && /^[A-Z0-9]{10}$/.test(asin);
}

/**
 * 🚀 FIX + OVERWRITE DATA
 */
function run() {

  console.log("\n🧼 FIXING PRODUCT DATA...\n");

  const valid = CLEAN_PRODUCTS.filter(p => {
    if (!isValidASIN(p.asin)) {
      console.error("❌ Invalid ASIN:", p.title, p.asin);
      return false;
    }
    return true;
  });

  fs.writeFileSync(FILE, JSON.stringify(valid, null, 2));

  console.log("✅ PRODUCTS RESET COMPLETE");
  console.log("📦 Total valid products:", valid.length);
}

run();
