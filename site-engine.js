(function () {

  // -----------------------------
  // CONFIG CHECK
  // -----------------------------
  if (!window.AFFILIATE_TAG) {
    console.warn("Affiliate tag missing (config.js not loaded)");
  }

  // -----------------------------
  // CLICK TRACKER (LIGHT WRAPPER)
  // -----------------------------
  function initTracker() {
    if (window.__trackerLoaded) return;
    window.__trackerLoaded = true;

    const STORAGE_KEY = "affiliate_click_data_v1";

    function getData() {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    }

    function saveData(data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function track(asin) {
      if (!asin) return;

      const data = getData();

      if (!data[asin]) {
        data[asin] = { clicks: 0 };
      }

      data[asin].clicks += 1;

      saveData(data);
    }

    document.querySelectorAll("a[data-asin]").forEach(link => {
      link.addEventListener("click", () => {
        track(link.dataset.asin);
      });
    });
  }

  // -----------------------------
  // BOOST VISUAL WINNERS
  // -----------------------------
  function initBoost() {
    const data = JSON.parse(localStorage.getItem("affiliate_click_data_v1") || "{}");

    document.querySelectorAll("[data-asin]").forEach(btn => {
      const score = data[btn.dataset.asin]?.clicks || 0;

      if (score > 2) {
        btn.style.border = "2px solid #f59e0b";
        btn.style.transform = "scale(1.02)";
        btn.style.transition = "0.2s";
      }
    });
  }

  // -----------------------------
  // AUTO RANK PRODUCTS
  // -----------------------------
  function initAutoRank() {
    const container = document.querySelector("#product-container");
    if (!container) return;

    const data = JSON.parse(localStorage.getItem("affiliate_click_data_v1") || "{}");

    const items = Array.from(container.querySelectorAll(".product-card"));

    items.sort((a, b) => {
      const aScore = data[a.dataset.asin]?.clicks || 0;
      const bScore = data[b.dataset.asin]?.clicks || 0;
      return bScore - aScore;
    });

    items.forEach(item => container.appendChild(item));
  }

  // -----------------------------
  // SILO LINKS
  // -----------------------------
  function initSilo() {

    const path = location.pathname.toLowerCase();

    let category = null;

    if (path.includes("vacuum")) category = "vacuum";
    if (path.includes("coffee")) category = "coffee";
    if (path.includes("survival") || path.includes("solar")) category = "survival";

    if (!category) return;

    const map = {
      vacuum: [
        "vacuum-hub.html",
        "best-vacuum-cleaners-en.html",
        "guide-vacuum-cleaners-en.html"
      ],
      coffee: [
        "coffee-hub.html",
        "best-coffee-makers-en.html",
        "guide-coffee-makers-en.html"
      ],
      survival: [
        "survival-hub.html",
        "portable-power-banks.html",
        "solar-generator-kit.html"
      ]
    };

    const box = document.createElement("div");

    box.style.cssText = `
      margin-top:30px;
      padding:20px;
      background:#111827;
      color:white;
      border-radius:12px;
      font-family:Arial;
    `;

    box.innerHTML = `<b>🔗 Explore More</b><br><br>`;

    map[category].forEach(link => {
      const a = document.createElement("a");
      a.href = link;
      a.innerText = "→ " + link.replace(".html", "").replace(/-/g, " ");
      a.style.display = "block";
      a.style.color = "#60a5fa";
      a.style.marginTop = "6px";
      box.appendChild(a);
    });

    document.body.appendChild(box);
  }

  // -----------------------------
  // INIT ALL SYSTEMS
  // -----------------------------
  document.addEventListener("DOMContentLoaded", function () {
    initTracker();
    initBoost();
    initAutoRank();
    initSilo();
  });

})();
