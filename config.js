// ===============================
// 🔒 GLOBAL AFFILIATE + SEO LOCK
// ===============================

window.AFFILIATE_TAG = "brightlane201-20";

// -------------------------------
// SAFE AMAZON LINK BUILDER
// -------------------------------
window.amazonUrl = function (asin, title = "") {
  if (!asin || typeof asin !== "string") return "#";

  const clean = asin.trim().toUpperCase();

  // Prevent broken Amazon links (fixes your 404 issue)
  if (!/^B[A-Z0-9]{9,10}$/.test(clean)) {
    console.warn("Invalid ASIN blocked:", asin, title);
    return "#";
  }

  return `https://www.amazon.com/dp/${clean}?tag=${window.AFFILIATE_TAG}`;
};

// -------------------------------
// CLICK TRACKING (OPTIONAL SAFE HOOK)
// -------------------------------
window.trackClick = function (asin, title, page) {
  try {
    console.log("Affiliate click:", {
      asin,
      title,
      page,
      time: new Date().toISOString()
    });

    // You can later connect GA4 or Plausible here
  } catch (e) {}
};

// -------------------------------
// PRODUCT VALIDATION HELPER
// -------------------------------
window.isValidProduct = function (p) {
  return (
    p &&
    typeof p === "object" &&
    p.asin &&
    /^B[A-Z0-9]{9,10}$/.test(p.asin)
  );
};
