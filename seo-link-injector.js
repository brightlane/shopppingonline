(function () {

  const LINKS = {
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

  function detectCategory() {
    const p = location.pathname.toLowerCase();

    if (p.includes("vacuum")) return "vacuum";
    if (p.includes("coffee")) return "coffee";
    if (p.includes("solar") || p.includes("power") || p.includes("survival")) return "survival";

    return null;
  }

  function createBox(category) {
    const box = document.createElement("div");

    box.style.cssText = `
      background:#111827;
      color:white;
      padding:15px;
      margin-top:30px;
      border-radius:12px;
      font-size:14px;
    `;

    box.innerHTML = `<b>🔥 Related ${category} pages</b><br><br>`;

    LINKS[category].forEach(link => {
      const a = document.createElement("a");
      a.href = link;
      a.innerText = "→ " + link.replace(".html", "").replace(/-/g, " ");
      a.style.display = "block";
      a.style.color = "#60a5fa";
      a.style.marginTop = "6px";
      box.appendChild(a);
    });

    return box;
  }

  function inject() {
    const cat = detectCategory();
    if (!cat) return;

    document.body.appendChild(createBox(cat));
  }

  document.addEventListener("DOMContentLoaded", inject);

})();
