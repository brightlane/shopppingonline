function trackClick(productName, url) {
  // Get existing stats
  let stats = JSON.parse(localStorage.getItem("clickStats")) || {};

  // Increase count
  stats[productName] = (stats[productName] || 0) + 1;

  // Save back
  localStorage.setItem("clickStats", JSON.stringify(stats));

  // Redirect to Amazon
  window.open(url, "_blank");
}
