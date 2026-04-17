(function () {

  const FALLBACK_IMAGE =
    "https://via.placeholder.com/600x400?text=No+Image+Available";

  function fixBrokenImages() {

    document.querySelectorAll("img").forEach(img => {

      // If missing src or invalid
      const src = img.getAttribute("src");

      if (!src || src === "" || src.includes("undefined") || src.includes("null")) {
        img.src = FALLBACK_IMAGE;
      }

      // If image fails to load
      img.onerror = function () {
        this.onerror = null;
        this.src = FALLBACK_IMAGE;
      };
    });
  }

  document.addEventListener("DOMContentLoaded", fixBrokenImages);

})();
