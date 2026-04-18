(function () {
  const CONFIG = {
    US: { domain: "amazon.com", tag: "brightlane201-20" },
    UK: { domain: "amazon.co.uk", tag: "brightlane201-21" },
    DE: { domain: "amazon.de", tag: "brightlane201-21" },
    CA: { domain: "amazon.ca", tag: "brightlane201-20" }
  };

  function detectCountry() {
    // fallback logic (you can replace with IP geo later)
    return localStorage.getItem("country") || "US";
  }

  function buildLink(url) {
    const country = detectCountry();
    const { tag } = CONFIG[country] || CONFIG.US;

    const hasTag = url.includes("tag=");
    if (hasTag) return url;

    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}tag=${tag}`;
  }

  function rewriteAllLinks() {
    document.querySelectorAll("a[href*='amazon.']").forEach(a => {
      a.href = buildLink(a.href);
    });
  }

  document.addEventListener("DOMContentLoaded", rewriteAllLinks);
})();
