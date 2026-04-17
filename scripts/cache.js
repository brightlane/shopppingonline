const fs = require("fs");
const path = require("path");
const { fetchProduct } = require("./paapi");

const CACHE_FILE = path.join(__dirname, "../data/cache.json");

function load() {
  if (!fs.existsSync(CACHE_FILE)) return {};
  return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
}

function save(data) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
}

function isFresh(entry) {
  const DAY = 1000 * 60 * 60 * 24;
  return entry && (Date.now() - entry.updated < DAY);
}

async function runCache(products) {
  const cache = load();
  const output = [];

  for (const p of products) {
    const cached = cache[p.asin];

    if (isFresh(cached)) {
      output.push(cached);
      continue;
    }

    const fresh = await fetchProduct(p.asin);

    if (fresh) {
      cache[p.asin] = {
        ...fresh,
        updated: Date.now()
      };
      output.push(cache[p.asin]);
    } else {
      output.push(p);
    }
  }

  save(cache);

  return output;
}

module.exports = { runCache };
