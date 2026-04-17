const TRENDING_ENGINE = {
  // Merge clicks into product list and rank them
  rankProducts: function (products) {
    const clickData = CLICK_SYSTEM.getData();

    return products
      .map(p => {
        return {
          ...p,
          clicks: clickData[p.asin] || 0
        };
      })
      .sort((a, b) => {
        // Primary sort: clicks
        if (b.clicks !== a.clicks) {
          return b.clicks - a.clicks;
        }

        // Secondary sort: rating (fallback)
        return (b.rating || 0) - (a.rating || 0);
      });
  },

  // Render trending section
  renderTrending: function (containerId, products, limit = 6) {
    const container = document.getElementById(containerId);

    if (!container) return;

    const ranked = this.rankProducts(products).slice(0, limit);

    container.innerHTML = "";

    ranked.forEach(p => {
      const url = AFFILIATE_CONFIG.buildUrl(p.asin);

      container.innerHTML += `
        <div class="card">
          <h3>${p.title}</h3>

          <p style="color:#b12704;font-weight:bold;">
            ${p.price || ""}
          </p>

          <p style="font-size:12px;color:#555;">
            ⭐ ${p.rating || "N/A"} • 🔥 ${p.clicks || 0} clicks
          </p>

          <a class="btn"
             href="#"
             onclick="CLICK_SYSTEM.trackClick('${p.asin}'); window.open(AFFILIATE_CONFIG.buildUrl('${p.asin}'), '_blank');">
             View on Amazon
          </a>
        </div>
      `;
    });
  }
};
