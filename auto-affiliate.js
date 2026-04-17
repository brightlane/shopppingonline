// auto-affiliate.js

(function () {
  const AFFILIATE_TAG = "brightside20-20";

  function addTag(url) {
    try {
      if (!url.includes("amazon.com")) return url;

      // Avoid duplicate tags
      if (url.includes("tag=")) return url;

      return url.includes("?")
        ? url + "&tag=" + AFFILIATE_TAG
        : url + "?tag=" + AFFILIATE_TAG;
    } catch (e) {
      return url;
    }
  }

  function fixLinks() {
    const links = document.querySelectorAll("a");

    links.forEach(link => {
      if (link.href && link.href.includes("amazon.com")) {
        link.href = addTag(link.href);

        // Add SEO-safe attributes
        link.setAttribute("rel", "nofollow sponsored");
        link.setAttribute("target", "_blank");
      }
    });
  }

  // Run immediately
  fixLinks();

  // Also watch for dynamically added content
  const observer = new MutationObserver(() => {
    fixLinks();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
