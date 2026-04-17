const fs = require("fs");
const path = require("path");

const CACHE = path.join(__dirname, "../data/products-cache.json");
const SOURCE = path.join(__dirname, "../data/products-source.json");

function load(file) {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

async function runCache() {
  console.log("💾 Running cache layer...");

  const source = load(SOURCE);
  const cache = fs.existsSync(CACHE) ? load(CACHE) : {};

  const merged = source.map(p => {
    const cached = cache[p.asin];

    if (cached && cached.image) {
      return { ...p, ...cached };
    }

    return p;
  });

  save(CACHE, merged.reduce((acc, p) => {
    acc[p.asin] = p;
    return acc;
  }, {}));

  console.log("✅ Cache updated");
}

module.exports = { runCache };
