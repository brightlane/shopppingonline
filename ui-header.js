(function () {

  const headerHTML = `
    <div class="site-header">

      <div style="font-weight:bold; font-size:18px;">
        🔥 BrightLane Deals
      </div>

      <div class="search-bar">
        <input type="text" placeholder="Search products, reviews, deals...">
        <button>Search</button>
      </div>

    </div>

    <div class="nav">
      <a href="/index.html">Home</a>
      <a href="/best-vacuum-cleaners-en.html">Vacuum Cleaners</a>
      <a href="/best-coffee-makers-en.html">Coffee Makers</a>
      <a href="/power-survival-hub.html">Survival Gear</a>
      <a href="/categories.html">Categories</a>
    </div>
  `;

  document.addEventListener("DOMContentLoaded", function () {
    document.body.insertAdjacentHTML("afterbegin", headerHTML);
  });

})();
