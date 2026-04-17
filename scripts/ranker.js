const fs = require("fs");

const FILE = "./data/clicks.json";

function load() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function score(product) {
  const clicks = load();
  return clicks[product.asin] || 0;
}

function sort(products) {
  return products.sort((a, b) => score(b) - score(a));
}

module.exports = { sort };
