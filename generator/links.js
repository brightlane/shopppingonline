const products = require("./amazon-products");

function linkify(product) {
  const related = products.filter(
    p => p.category === product.category && p.asin !== product.asin
  );

  return related
    .map(p => `<a href="${p.asin}.html">${p.title}</a>`)
    .join(" | ");
}

module.exports = linkify;
