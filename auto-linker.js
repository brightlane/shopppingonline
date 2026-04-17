// =====================================
// 🔗 AUTO SEO INTERNAL LINKER SYSTEM
// Builds authority + fixes orphan pages
// =====================================

(function () {
  const CONFIG = {
    baseUrl: "https://brightlane.github.io/shopppingonline/",
    categories: [
      "vacuum-cleaners",
      "coffee-makers",
      "stanley-quencher-tumblers",
      "acne-patches",
      "ring-lights-for-phone"
    ]
  };

  // -----------------------------
  // SAFE LINK GENERATOR
  // -----------------------------
  function buildLink(path) {
    return `${CONFIG.baseUrl}${path}`;
  }

  // -----------------------------
  // AUTO DETECT PAGE CATEGORY
  // -----------------------------
  function detectCategory() {
    const path = window.location.pathname;

    for (const cat of CONFIG.categories) {
      if (path.includes(cat)) return cat;
    }
    return null;
  }

  // -----------------------------
  // CREATE INTERNAL LINK BLOCK
  // -----------------------------
  function createLinkBlock(category) {
    const links = CONFIG.categories
      .filter(c => c !== category)
      .map(c => {
        return `
          <a href="${buildLink(c + ".html")}"
             style="
               display:inline-block;
               margin:6px;
               padding:8px 12px;
               background:#f3f4f6;
               border-radius:6px;
               text-decoration:none;
               color:#111;
               font-size:14px;
             ">
             ${c.replace(/-/g, " ")}
          </a>
        `;
      })
      .join("");

    return `
      <section style="max-width:1000px;margin:50px auto;text-align:center;">
        <h2 style="margin-bottom:15px;">Explore More Categories</h2>
        <div>${links}</div>
      </section>
    `;
  }

  // -----------------------------
  // INSERT INTO PAGE
  // -----------------------------
  function injectLinks() {
    const category = detectCategory();
    if (!category) return;

    const block = createLinkBlock(category);

    const container = document.querySelector("body");

    if (container) {
      container.insertAdjacentHTML("beforeend", block);
    }
  }

  // -----------------------------
  // AUTO EXECUTE
  // -----------------------------
  document.addEventListener("DOMContentLoaded", injectLinks);
})();
