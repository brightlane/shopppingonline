(function () {

  function getData() {
    return JSON.parse(localStorage.getItem("affiliate_click_data_v1") || "{}");
  }

  function getScore(asin, data) {
    return data[asin]?.clicks || 0;
  }

  function rankProducts() {
    const data = getData();

    const container = document.querySelector("#product-container");
    if (!container) return;

    const items = Array.from(container.querySelectorAll(".product-card"));

    // attach score to each card
    items.forEach(card => {
      const asin = card.dataset.asin;
      card.dataset.score = getScore(asin, data);
    });

    // sort by score (highest first)
    items.sort((a, b) => {
      return Number(b.dataset.score) - Number(a.dataset.score);
    });

    // re-append in new order
    items.forEach(card => {
      container.appendChild(card);
    });

    console.log("Auto-ranking complete");
  }

  document.addEventListener("DOMContentLoaded", rankProducts);

})();
