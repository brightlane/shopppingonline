(function () {

  function getData() {
    return JSON.parse(localStorage.getItem("affiliate_click_data_v1") || "{}");
  }

  function rankLinks() {
    const data = getData();

    const buttons = Array.from(document.querySelectorAll("[data-asin]"));

    buttons.sort((a, b) => {
      const aScore = data[a.dataset.asin]?.clicks || 0;
      const bScore = data[b.dataset.asin]?.clicks || 0;
      return bScore - aScore;
    });

    const container = document.body;

    buttons.forEach(btn => {
      btn.style.border = "2px solid transparent";

      const score = data[btn.dataset.asin]?.clicks || 0;

      if (score > 2) {
        btn.style.border = "2px solid #f59e0b";
        btn.style.transform = "scale(1.02)";
      }

      container.appendChild(btn);
    });
  }

  document.addEventListener("DOMContentLoaded", rankLinks);

})();
