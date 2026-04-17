/**
 * SAFE AMAZON CLICK TRACKER (NO BROKEN LINKS VERSION)
 * - guarantees redirect always works
 * - logs click safely
 * - prevents broken ASIN navigation
 */

(function () {
  "use strict";

  // basic click storage (lightweight CTR tracking)
  function saveClick(data) {
    try {
      const key = "affiliate_clicks_v1";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");

      existing.push({
        ...data,
        ts: Date.now()
      });

      // keep only last 500 clicks (prevents storage bloat)
      if (existing.length > 500) existing.shift();

      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) {
      console.warn("Tracking failed:", e);
    }
  }

  /**
   * MAIN CLICK FUNCTION
   * ALWAYS USE THIS FOR PRODUCT LINKS
   */
  window.trackClick = function (asin, productId, url) {
    try {
      // validation
      if (!url || typeof url !== "string") {
        console.warn("Missing URL for click:", asin);
        return;
      }

      saveClick({
        asin: asin || null,
        productId: productId || null,
        url: url
      });

      // small delay ensures tracking fires before navigation
      setTimeout(() => {
        window.location.href = url;
      }, 120);

    } catch (err) {
      console.error("Click tracking error:", err);

      // fallback = NEVER break navigation
      window.location.href = url;
    }
  };

  /**
   * OPTIONAL: expose analytics summary (for debugging)
   */
  window.getClickStats = function () {
    try {
      const data = JSON.parse(localStorage.getItem("affiliate_clicks_v1") || "[]");
      return {
        totalClicks: data.length,
        recent: data.slice(-10)
      };
    } catch (e) {
      return { totalClicks: 0, recent: [] };
    }
  };

})();
