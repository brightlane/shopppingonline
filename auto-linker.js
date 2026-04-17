(function () {
  "use strict";

  // ==============================
  // 🔗 INTERNAL SEO LINK ENGINE
  // ==============================

  const CONFIG = {
    categories: [
      "vacuum-cleaners",
      "coffee-makers",
      "stanley-quencher-tumblers",
      "acne-patches",
      "ring-lights-for-phone"
    ],

    pageTypes: [
      "best",
      "top",
      "ultimate",
      "guide",
      "review",
      "vs",
      "buying",
      "ranking"
    ]
  };

  // ------------------------------
  // GET ALL INTERNAL LINKS
  // ------------------------------
  function generateLinks() {
    const links = [];

    CONFIG.categories.forEach(cat => {
      CONFIG.pageTypes.forEach(type => {
        links.push(`/${type}-${cat}-en.html`);
      });
    });

    return links;
  }

  const allLinks = generateLinks();

  // ------------------------------
  // SMART LINK PICKER
  // ------------------------------
  function pickLinks(count = 6) {
    const shuffled = [...allLinks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // ------------------------------
  // INJECT INTO PAGE
  // ------------------------------
  function injectLinks() {
    const container = document.createElement("div");

    container.style.cssText = `
      margin-top:40px;
      padding:20px;
      background:#ffffff;
      border-radius:14px;
      box-shadow:0 10px 25px rgba(0,0,0,0.08);
      font-family:system-ui;
    `;

    const links = pickLinks(8);

    container.innerHTML = `
      <h3 style="margin-bottom:10px;">🔗 Explore More Guides</h3>
      <div style="display:flex;flex-wrap:wrap;gap:10px;">
        ${links.map(l => `
          <a href="${l}" style="
            padding:8px 12px;
            background:#f3f4f6;
            border-radius:8px;
            text-decoration:none;
            font-size:13px;
            color:#111;
          ">${l.replace("/", "")}</a>
        `).join("")}
      </div>
    `;

    document.body.appendChild(container);
  }

  // ------------------------------
  // CONTEXTUAL BOOST LINKS
  // ------------------------------
  function injectContextLinks() {
    const h1 = document.querySelector("h1");
    if (!h1) return;

    const cat = location.pathname;

    const related = CONFIG.categories
      .filter(c => cat.includes(c))
      .map(c => `/best-${c}-en.html`);

    if (!related.length) return;

    const box = document.createElement("div");
    box.style.cssText = "margin:20px 0;font-size:14px;color:#333;";

    box.innerHTML = `
      <b>🔥 Related Category Hub:</b>
      ${related
        .map(r => `<a href="${r}" style="margin-left:10px;">View</a>`)
        .join("")}
    `;

    h1.insertAdjacentElement("afterend", box);
  }

  // ------------------------------
  // AUTO RUN
  // ------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    injectLinks();
    injectContextLinks();
  });

})();
