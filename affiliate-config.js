const AFFILIATE_CONFIG = {
  tag: "brightlane201-20",
  domain: "https://www.amazon.com",

  /**
   * HARD-SAFE Amazon URL builder
   * Prevents 404s by enforcing strict format
   */
  buildUrl: function (asin) {
    if (!asin || asin.length !== 10) {
      console.error("Invalid ASIN:", asin);
      return this.domain;
    }

    // ALWAYS clean + strict format (prevents broken redirects)
    return `${this.domain}/dp/${asin}?tag=${this.tag}`;
  }
};
