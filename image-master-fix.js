(function () {

  const FALLBACK_IMAGE =
    "https://via.placeholder.com/600x400?text=Image+Unavailable";

  /**
   * 🔥 FIX ALL IMAGES ON PAGE LOAD
   */
  function fixAllImages() {

    document.querySelectorAll("img").forEach(img => {

      const src = img.getAttribute("src");

      // CASE 1: missing image
      if (!src || src === "" || src.includes("undefined") || src.includes("null")) {
        img.src = FALLBACK_IMAGE;
      }

      // CASE 2: broken image load
      img.onerror = function () {
        this.onerror = null;
        this.src = FALLBACK_IMAGE;
      };
    });
  }

  /**
   * 🔥 ALSO FIX DYNAMICALLY LOADED IMAGES
   */
  const observer = new MutationObserver(() => {
    fixAllImages();
  });

  document.addEventListener("DOMContentLoaded", () => {
    fixAllImages();

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });

})();
