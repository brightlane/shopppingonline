(function () {

  const headerHTML = `
    <header class="site-header">
      <h1>🔥 BrightLane Deals Hub</h1>
      <p>Best reviewed products • Trusted comparisons • Updated 2026</p>
    </header>

    <nav class="nav">
      <a href="/index.html">Home</a>
      <a href="/best-vacuum-cleaners-en.html">Vacuum Cleaners</a>
      <a href="/best-coffee-makers-en.html">Coffee Makers</a>
      <a href="/power-survival-hub.html">Survival Gear</a>
      <a href="/categories.html">Categories</a>
    </nav>
  `;

  document.addEventListener("DOMContentLoaded", function () {
    document.body.insertAdjacentHTML("afterbegin", headerHTML);
  });

})();
