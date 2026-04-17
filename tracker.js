// tracker.js

function trackClick(productId, asin) {
  const data = {
    productId,
    asin,
    time: new Date().toISOString()
  };

  console.log("TRACK:", data);

  // OPTIONAL: send to backend later
  // fetch("/track", {
  //   method: "POST",
  //   body: JSON.stringify(data)
  // });
}
