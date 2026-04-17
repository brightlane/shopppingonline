(function () {

  const STORAGE_KEY = "affiliate_click_data_v1";

  function loadData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function track(asin, url) {
    if (!asin) return;

    const data = loadData();

    if (!data[asin]) {
      data[asin] = { clicks: 0, lastClick: null };
    }

    data[asin].clicks += 1;
    data[asin].lastClick = new Date().toISOString();

    saveData(data);

    console.log("Tracked click:", asin, data[asin]);
  }

  function extractASIN(url) {
    const match = url.match(/\/dp\/([A-Z0-9]{10})/);
    return match ? match[1] : null;
  }

  function enhanceLinks() {
    const links = document.querySelectorAll("a");

    links.forEach(link => {
      const href = link.getAttribute("href");
      if (!href || !href.includes("amazon.com")) return;

      const asin = extractASIN(href);

      if (asin) {
        link.addEventListener("click", () => track(asin, href));
      }
    });
  }

  document.addEventListener("DOMContentLoaded", enhanceLinks);

})();
