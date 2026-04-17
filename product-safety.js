(function () {
  /**
   * 🔥 AMAZON AFFILIATE TAG
   */
  const AFFILIATE_TAG = "brightlane201-20";

  /**
   * 🧠 VALID ASIN CHECK (prevents fake / broken Amazon links)
   */
  function isValidASIN(asin) {
    return typeof asin === "string" && /^[A-Z0-9]{10}$/.test(asin);
  }

  /**
   * 🔗 SAFE AMAZON LINK BUILDER
   * - removes tag from validation check
   * - avoids broken / malformed URLs
   */
  function amazonLink(asin) {
    if (!isValidASIN(asin)) {
      return "#"; // prevents 404 clicks
    }

    return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
  }

  /**
   * 🖼️ SAFE IMAGE HANDLER
   * - prevents empty image blocks
   */
  function safeImage(img) {
    if (img && img.startsWith("http")) return img;

    // fallback image (safe generic product image)
    return "https://via.placeholder.com/600x400?text=Product+Image+Unavailable";
  }

  /**
   * 🔧 FIX ALL PRODUCT CARDS ON PAGE
   */
  function fixProductCards() {
    const cards = document.querySelectorAll("[data-asin]");

    cards.forEach(card => {
      const asin = card.getAttribute("data-asin");

      // Fix Amazon links
      const link = card.querySelector("a");
      if (link) {
        link.href = amazonLink(asin);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "nofollow sponsored noopener");
      }

      // Fix images if they exist
      const img = card.querySelector("img");
      if (img) {
        img.src = safeImage(img.getAttribute("src"));
      }
    });
  }

  /**
   * 🚀 INIT
   */
  function init() {
    fixProductCards();
    console.log("✅ Product safety layer active");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
