(function () {
  /**
   * 🔥 AMAZON AFFILIATE CONFIG (single source of truth)
   */
  const AFFILIATE_TAG = "brightlane201-20";

  /**
   * 🛡️ SAFE AMAZON LINK BUILDER
   * Ensures every product always keeps affiliate tag
   */
  function amazonLink(asin) {
    if (!asin) return "#";

    return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
  }

  /**
   * 🔄 FIX ALL AMAZON LINKS ON PAGE
   * Prevents missing tags or broken URLs
   */
  function normalizeAmazonLinks() {
    const links = document.querySelectorAll("a[data-asin]");

    links.forEach(link => {
      const asin = link.getAttribute("data-asin");

      if (!asin) return;

      const correctUrl = amazonLink(asin);

      // Force correct affiliate link
      link.href = correctUrl;

      // safety attributes
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "nofollow sponsored noopener");
    });
  }

  /**
   * 📊 CLICK TRACKING (lightweight local analytics)
   */
  function trackClicks() {
    document.addEventListener("click", function (e) {
      const el = e.target.closest("[data-asin]");
      if (!el) return;

      const asin = el.getAttribute("data-asin");

      const key = "affiliate_click_data_v1";
      const data = JSON.parse(localStorage.getItem(key) || "{}");

      data[asin] = data[asin] || { clicks: 0 };
      data[asin].clicks++;

      localStorage.setItem(key, JSON.stringify(data));
    });
  }

  /**
   * 🔁 AUTO-REDIRECT FIX (prevents 404 product clicks)
   */
  function fixBrokenProductLinks() {
    document.querySelectorAll("a").forEach(a => {
      const href = a.getAttribute("href");

      if (!href) return;

      // If local product page missing format detected
      if (href.includes(".html") && !href.startsWith("http")) {
        a.addEventListener("click", function (e) {
          // fallback to homepage if broken route
          setTimeout(() => {
            if (document.location.pathname.includes("404")) {
              window.location.href = "/index.html";
            }
          }, 100);
        });
      }
    });
  }

  /**
   * 🚀 INIT SYSTEM
   */
  function init() {
    normalizeAmazonLinks();
    trackClicks();
    fixBrokenProductLinks();

    console.log("✅ Router system initialized");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
