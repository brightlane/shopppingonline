const AMAZON_LINK_GUARD = {
  tag: "brightlane201-20",
  domain: "https://www.amazon.com",

  /**
   * Strict ASIN validation
   */
  isValidASIN: function (asin) {
    return typeof asin === "string" && /^[A-Z0-9]{10}$/.test(asin);
  },

  /**
   * Build SAFE Amazon URL (no 404 risk)
   */
  buildUrl: function (asin) {
    if (!this.isValidASIN(asin)) {
      console.error("❌ BLOCKED INVALID ASIN:", asin);
      return null;
    }

    return `${this.domain}/dp/${asin}?tag=${this.tag}`;
  },

  /**
   * Safe navigation handler (use this everywhere)
   */
  openProduct: function (asin) {
    const url = this.buildUrl(asin);

    if (!url) {
      alert("This product link is not valid.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  },

  /**
   * Safe anchor generator (optional use in renderers)
   */
  createLinkHTML: function (asin, label = "View on Amazon") {
    const url = this.buildUrl(asin);

    if (!url) return "";

    return `<a href="${url}" target="_blank" rel="noopener sponsored">${label}</a>`;
  }
};
