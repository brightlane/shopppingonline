const AFFILIATE_CONFIG = {
  tag: "brightlane201-20",

  // Primary Amazon domain (safe global fallback)
  defaultDomain: "https://www.amazon.com",

  /**
   * Build international-safe Amazon URL
   * Works for US + international traffic routing
   */
  buildUrl: function (asin) {
    return `${this.defaultDomain}/dp/${asin}/?tag=${this.tag}`;
  }
};
