(function () {

  function fixAllAmazonLinks() {
    const links = document.querySelectorAll("a");

    links.forEach(link => {
      const href = link.getAttribute("href");
      if (!href) return;

      // detect broken or raw ASIN usage
      const asinMatch = href.match(/[A-Z0-9]{10}/);

      if (href.includes("amazon") && asinMatch) {
        const cleanASIN = asinMatch[0];

        if (window.amazonLink) {
          link.setAttribute("href", window.amazonLink(cleanASIN));
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "nofollow sponsored");
        }
      }
    });
  }

  function trackClick(e) {
    const link = e.target.closest("a");
    if (!link) return;

    if (link.href.includes("amazon.com")) {
      console.log("Amazon click tracked:", link.href);

      // optional tracking hook (future ads/analytics)
      if (window.gtag) {
        window.gtag("event", "affiliate_click", {
          url: link.href
        });
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    fixAllAmazonLinks();
    document.body.addEventListener("click", trackClick);
  });

})();
