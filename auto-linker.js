
// ================================
// 🔗 INTERNAL SEO LINK GRAPH SYSTEM
// ================================

const LINK_GRAPH = {
  vacuum: ["coffee", "ring_light", "stanley", "acne_patch"],
  coffee: ["vacuum", "stanley", "ring_light"],
  stanley: ["vacuum", "coffee", "ring_light"],
  acne_patch: ["coffee", "skincare"],
  ring_light: ["coffee", "content_creation", "vacuum"]
};

// ================================
// 🧠 SAFE LINK GENERATOR
// ================================

function buildInternalLink(category) {
  if (!category) return "";

  const urlMap = {
    vacuum: "best-vacuum-cleaners-en.html",
    coffee: "best-coffee-makers-en.html",
    stanley: "best-stanley-quencher-tumblers-en.html",
    acne_patch: "best-acne-patches-en.html",
    ring_light: "best-ring-lights-for-phone-en.html"
  };

  const url = urlMap[category];
  if (!url) return "";

  return `<a href="${url}" style="
    display:inline-block;
    margin:4px 6px 4px 0;
    padding:6px 10px;
    background:#f3f4f6;
    border-radius:8px;
    font-size:12px;
    text-decoration:none;
    color:#111;
  ">Related: ${category.replace("_", " ")}</a>`;
}

// ================================
// 🔥 AUTO-INJECT INTERNAL LINKS INTO PAGE
// ================================

function injectInternalLinks(currentCategory) {
  const container = document.getElementById("internal-links");
  if (!container) return;

  const related = LINK_GRAPH[currentCategory] || [];

  container.innerHTML = `
    <div style="margin:20px 0;padding:15px;background:#fff;border-radius:12px;box-shadow:0 8px 20px rgba(0,0,0,0.05);">
      <h3 style="margin:0 0 10px;font-size:14px;">🔗 Explore Related Categories</h3>
      ${related.map(buildInternalLink).join("")}
    </div>
  `;
}

// ================================
// 📊 CONTEXTUAL LINK INSERTION (FOR PRODUCT PAGES)
// ================================

function insertContextualLinks(productCategory) {
  const box = document.getElementById("context-links");
  if (!box) return;

  const related = LINK_GRAPH[productCategory] || [];

  box.innerHTML = `
    <div style="margin-top:20px;font-size:13px;color:#444;">
      <strong>More categories:</strong><br/>
      ${related.map(buildInternalLink).join("")}
    </div>
  `;
}
