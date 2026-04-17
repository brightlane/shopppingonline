const fs = require("fs");

const CATEGORIES = [
  { name: "Vacuum Cleaners", slug: "vacuum-hub.html" },
  { name: "Coffee Makers", slug: "coffee-hub.html" },
  { name: "Stanley Quencher Tumblers", slug: "tumblers-hub.html" },
  { name: "Acne Patches", slug: "acne-hub.html" },
  { name: "Ring Lights for Phone", slug: "ring-light-hub.html" }
];

/**
 * 🧱 BUILD NAV HTML
 */
function buildNav() {

  return `
<div style="
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  justify-content:center;
  padding:10px;
  background:#ffffff;
  border-bottom:1px solid #ddd;
  margin-bottom:20px;
  font-family:Arial;
">

  ${CATEGORIES.map(c => `
    <a href="/shopppingonline/${c.slug}"
       style="
        padding:8px 12px;
        background:#f3f4f6;
        border-radius:8px;
        text-decoration:none;
        color:#111;
        font-size:14px;
       ">
      ${c.name}
    </a>
  `).join("")}

</div>
`;
}

/**
 * 📦 EXPORT NAV
 */
function getNav() {
  return buildNav();
}

module.exports = {
  getNav
};
