const SEO_INJECTOR = {
  categories: [
    { key: "coffee", label: "Coffee Makers" },
    { key: "vacuum", label: "Vacuum Cleaners" },
    { key: "survival", label: "Survival Gear" },
    { key: "ringlight", label: "Ring Lights" }
  ],

  /**
   * Inject internal links into a container
   */
  injectCategoryLinks: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = this.categories.map(c => {
      return `
        <a class="seo-link" href="category.html?type=${c.key}">
          Best ${c.label} →
        </a>
      `;
    }).join("");
  },

  /**
   * Inject related category suggestions under products
   */
  injectRelated: function (currentCategory, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const related = this.categories.filter(c => c.key !== currentCategory);

    container.innerHTML = related.map(c => {
      return `
        <div class="card">
          <h3>Explore ${c.label}</h3>
          <p>Discover top-rated ${c.label.toLowerCase()} for 2026.</p>
          <a class="btn" href="category.html?type=${c.key}">
            View ${c.label}
          </a>
        </div>
      `;
    }).join("");
  }
};
