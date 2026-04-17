(function () {

  const LINK_MAP = {
    vacuum: [
      "vacuum-hub.html",
      "best-vacuum-cleaners-en.html",
      "review-vacuum-cleaners-en.html",
      "vs-vacuum-cleaners-en.html",
      "guide-vacuum-cleaners-en.html"
    ],

    coffee: [
      "coffee-hub.html",
      "best-coffee-makers-en.html",
      "review-coffee-makers-en.html",
      "vs-coffee-makers-en.html",
      "guide-coffee-makers-en.html"
    ],

    survival: [
      "survival-hub.html",
      "portable-power-banks.html",
      "solar-generator-kit.html",
      "lifestraw-water-filter.html",
      "survival-kit.html"
    ]
  };

  function detectCategory() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes("vacuum")) return "vacuum";
    if (path.includes("coffee")) return "coffee";
    if (path.includes("survival") || path.includes("power") || path.includes("solar")) return "survival";

    return null;
  }

  function createLink(href) {
    const a = document.createElement("a");
    a.href = href;
    a.style.display = "block";
    a.style.margin = "6px 0";
    a.style.color = "#2563eb";
    a.style.textDecoration = "none";
    a.innerText = "→ Related: " + href.replace(".html", "").replace(/-/g, " ");
    return a;
  }

  function injectLinks() {
    const category = detectCategory();
    if (!category) return;

    const pages = LINK_MAP[category];
    const container = document.createElement("div");

    container.style.cssText = `
      position: fixed;
      right: 15px;
      bottom: 15px;
      width: 260px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 12px;
      padding: 12px;
      font-size: 13px;
      z-index: 99999;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    `;

    const title = document.createElement("div");
    title.innerText = "🔥 Related Pages";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "8px";

    container.appendChild(title);

    pages.forEach(p => {
      if (!window.location.pathname.includes(p)) {
        container.appendChild(createLink(p));
      }
    });

    document.body.appendChild(container);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectLinks);
  } else {
    injectLinks();
  }

})();
