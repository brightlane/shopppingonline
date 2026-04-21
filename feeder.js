/**
 * feeder.js
 * -------------------------
 * Generates product feed for build pipeline
 * Outputs: feed.json
 */

const fs = require("fs");
const path = require("path");

// =========================
// CONFIG
// =========================
const OUTPUT_FILE = path.join(__dirname, "feed.json");

// =========================
// SAMPLE DATA (replace later with API / Amazon PA-API)
// =========================
const rawProducts = [
  {
    asin: "B08TEST123",
    title: "Wireless Bluetooth Headphones",
    price: 39.99,
    category: "electronics",
    rating: 4.5,
    image: "https://via.placeholder.com/300",
    url: "https://amazon.com/dp/B08TEST123"
  },
  {
    asin: "B08TEST456",
    title: "Stainless Steel Water Bottle",
    price: 19.99,
    category: "home",
    rating: 4.7,
    image: "https://via.placeholder.com/300",
    url: "https://amazon.com/dp/B08TEST456"
  },
  {
    asin: "B08TEST789",
    title: "Portable LED Ring Light",
    price: 24.99,
    category: "content-creation",
    rating: 4.6,
    image: "https://via.placeholder.com/300",
    url: "https://amazon.com/dp/B08TEST789"
  }
];

// =========================
// VALIDATION
// =========================
function validateProduct(p) {
  return (
    p &&
    typeof p.asin === "string" &&
    typeof p.title === "string" &&
    typeof p.price === "number"
  );
}

// filter out bad entries
const products = rawProducts.filter(validateProduct);

// =========================
// ENRICH DATA (future SEO layer ready)
// =========================
const enriched = products.map((p) => ({
  ...p,
  slug: p.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, ""),

  timestamp: new Date().toISOString(),

  affiliateLink: `https://amazon.com/dp/${p.asin}?tag=yourtag-20`
}));

// =========================
// WRITE FILE
// =========================
try {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enriched, null, 2));

  console.log("====================================");
  console.log("✅ FEEDER SUCCESS");
  console.log("📦 Products:", enriched.length);
  console.log("📁 Output:", OUTPUT_FILE);
  console.log("====================================");
} catch (err) {
  console.error("❌ FEEDER FAILED:", err);
  process.exit(1);
}

// =========================
// DEBUG OUTPUT (optional)
// =========================
console.log("First product preview:");
console.log(enriched[0] || "No products generated");
