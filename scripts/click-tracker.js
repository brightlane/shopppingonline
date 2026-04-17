function trackClick(asin) {
  let data = JSON.parse(localStorage.getItem("clicks") || "{}");

  data[asin] = (data[asin] || 0) + 1;

  localStorage.setItem("clicks", JSON.stringify(data));
}
