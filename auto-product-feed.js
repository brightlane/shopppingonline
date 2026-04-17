const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "products-source.json");

/**
 * 🧠 FAKE DATA SOURCE (REPLACE LATER WITH API)
 * This simulates new incoming products
 */
function fetchNewProducts() {
  return [
    {
      asin: "B0TEST1234",
      title: "New Smart Vacuum Pro",
      category: "vacuum cleaners",
      price: 299,
      rating: 4.6,
      image: "https://via.placeholder.com/600x400?text=Vacuum"
    },
    {
      asin: "B0TEST5678",
      title: "Barista Coffee Maker X",
      category: "coffee makers",
      price: 199,
      rating: 4.7,
      image: "https://via.placeholder.com/600x400?text=Coffee"
    }
  ];
}

/**
 * 📦 LOAD EXISTING PRODUCTS
 */
function load() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

/**
 * 💾 SAVE PRODUCTS
 */
function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/**
 * 🧠 MERGE PRODUCTS (NO DUPLICATES)
 */
function merge(existing, incoming) {

  const map = {};

  existing.forEach(p => {
    map[p.asin] = p;
  });

  incoming.forEach(p => {
    map[p.asin] = {
      ...map[p.asin],
      ...p
    };
  });

  return Object.values(map);
}

/**
 * 🚀 RUN FEED ENGINE
 */
function run() {

  console.log("\n📡 FETCHING NEW PRODUCTS...\n");

  const existing = load();
  const incoming = fetchNewProducts();

  const merged = merge(existing, incoming);

  save(merged);

  console.log("✅ PRODUCT FEED UPDATED");
  console.log("📦 Total products:", merged.length);
}

run();
