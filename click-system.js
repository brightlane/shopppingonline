const CLICK_SYSTEM = {
  storageKey: "brightlane_click_data",

  // Load stored click data
  getData: function () {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  },

  // Save click data
  saveData: function (data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  },

  // Track a product click
  trackClick: function (asin) {
    const data = this.getData();

    if (!data[asin]) {
      data[asin] = 0;
    }

    data[asin] += 1;

    this.saveData(data);
  },

  // Get trending products sorted by clicks
  getTopProducts: function (products, limit = 10) {
    const data = this.getData();

    return products
      .map(p => {
        return {
          ...p,
          clicks: data[p.asin] || 0
        };
      })
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);
  }
};
