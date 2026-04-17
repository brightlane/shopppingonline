(function () {

  function getCategory() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes("vacuum")) return "vacuum";
    if (path.includes("coffee")) return "coffee";
    if (path.includes("survival") || path.includes("solar") || path.includes("power")) return "survival";

    return null;
  }

  function createSiloBox(category) {
    const box = document.createElement("div");

    box.style.cssText = `
      margin-top:30px;
      padding:20px;
      border-radius:12px;
      background:#111827;
      color:white;
      font-family:Arial;
    `;

    const links = {
      vacuum: [
        { name: "Vacuum Hub", url: "vacuum-hub.html" },
        { name: "Best Vacuum Cleaners", url: "best-vacuum-cleaners-en.html" },
        { name: "Vacuum Buying Guide", url: "guide-vacuum-cleaners-en.html" }
      ],
      coffee: [
        { name: "Coffee Hub", url: "coffee-hub.html" },
        { name: "Best Coffee Makers", url: "best-coffee-makers-en.html" },
        { name: "Coffee Buying Guide", url: "guide-coffee-makers-en.html" }
      ],
      survival: [
        { name: "Survival Hub", url: "survival-hub.html" },
        { name: "Emergency Gear", url: "portable-power-banks.html" },
        { name: "Solar Generator Guide", url: "solar-generator-kit.html" }
      ]
    };

    if (!links[category]) return;

    box.innerHTML = `<h3>🔗 Explore More in ${category}</h3>`;

    links[category].forEach(link => {
      const a = document.createElement("a");
      a.href = link.url;
      a.innerText = "→ " + link.name;
      a.style.display = "block";
      a.style.marginTop = "8px";
      a.style.color = "#60a5fa";
      box.appendChild(a);
    });

    document.body.appendChild(box);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const category = getCategory();
    if (category) createSiloBox(category);
  });

})();
