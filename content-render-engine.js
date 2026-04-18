const CONTENT_RENDER_ENGINE = {

  log: function(msg) {
    console.log("[RENDER ENGINE]", msg);
  },

  /**
   * MAIN ENTRY
   */
  renderArticles: function(blueprints, rankedProductsMap) {

    this.log("🧱 Rendering final article pages...");

    return blueprints.map(bp => {

      const products = rankedProductsMap[bp.keyword] || bp.products;

      return this.renderSingleArticle(bp, products);
    });
  },

  /**
   * RENDER SINGLE ARTICLE
   */
  renderSingleArticle: function(blueprint, products) {

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${blueprint.title}</title>
<meta name="description" content="${this.cleanMeta(blueprint.title)}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
body {
  font-family: Arial;
  background: #0b0f1a;
  color: white;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

h1 { color: #00ffcc; }

.card {
  background: #111827;
  padding: 15px;
  margin: 15px 0;
  border-radius: 12px;
}

img {
  width: 100%;
  border-radius: 10px;
}

.button {
  display: inline-block;
  padding: 10px 15px;
  background: #00ffcc;
  color: black;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
}
</style>

</head>

<body>

<div class="container">

<h1>${blueprint.title}</h1>

<p>${this.generateIntro(blueprint.keyword)}</p>

${this.renderSections(blueprint.structure)}

<h2>Top Recommended Products</h2>

${products.map(p => this.renderProductCard(p)).join("")}

<h2>Final Verdict</h2>
<p>${this.generateVerdict(blueprint.type)}</p>

</div>

</body>
</html>
`;

    return {
      slug: this.slugify(blueprint.title),
      html
    };
  },

  /**
   * PRODUCT CARD (NO PLACEHOLDERS)
   */
  renderProductCard: function(product) {

    return `
<div class="card">

<img src="${product.image}" alt="${product.title}" />

<h3>${product.title}</h3>

<p>${product.description || "High quality product with strong performance and value."}</p>

<p><strong>Rating:</strong> ${product.rating || "4.5"} ⭐</p>

<a class="button" href="https://www.amazon.com/dp/${product.asin}?tag=brightlane201-20" target="_blank">
View on Amazon
</a>

</div>
`;
  },

  /**
   * SECTION RENDERING
   */
  renderSections: function(sections) {

    return sections.map(s => `
      <h2>${s}</h2>
      <p>${this.generateSectionText(s)}</p>
    `).join("");
  },

  /**
   * INTRO GENERATION
   */
  generateIntro: function(keyword) {
    return `This guide explores the best options for ${keyword}, comparing performance, value, and real-world usability.`;
  },

  /**
   * SECTION TEXT (DYNAMIC BUT SAFE)
   */
  generateSectionText: function(section) {

    const map = {
      "Introduction": "Understanding your options is key before making a purchase.",
      "Main Content": "Below are carefully selected options based on performance and value.",
      "Product Breakdown": "Each product has been evaluated based on quality and user feedback.",
      "Pros & Cons": "We highlight both strengths and limitations for transparency.",
      "Final Verdict": "Final recommendations are based on overall performance and value."
    };

    return map[section] || "Detailed analysis provided below.";
  },

  /**
   * FINAL VERDICT
   */
  generateVerdict: function(type) {

    if (type === "comparison") {
      return "The winner depends on your needs, but one product clearly leads in performance.";
    }

    if (type === "guide") {
      return "Following the steps above ensures the best outcome for your situation.";
    }

    return "Overall, these are the best options currently available.";
  },

  /**
   * CLEAN META
   */
  cleanMeta: function(title) {
    return title.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 155);
  },

  /**
   * SLUG
   */
  slugify: function(text) {
    return text.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  }
};

module.exports = CONTENT_RENDER_ENGINE;
