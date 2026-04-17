(function () {

  // -----------------------------
  // SAFETY MODE: prevent click blocking
  // -----------------------------
  function enableSafeUI() {
    document.querySelectorAll("*").forEach(el => {
      el.style.pointerEvents = "auto";
    });
  }

  // -----------------------------
  // REMOVE COMMON OVERLAYS THAT BREAK CLICKS
  // -----------------------------
  function removeBlockingLayers() {
    const suspects = document.querySelectorAll(
      ".overlay, .modal, .backdrop, .loading, .popup, .cookie-banner"
    );

    suspects.forEach(el => {
      el.style.display = "none";
      el.style.pointerEvents = "none";
    });
  }

  // -----------------------------
  // DETECT FULL SCREEN BLOCKERS
  // -----------------------------
  function killFixedBlockers() {
    const all = document.querySelectorAll("body *");

    all.forEach(el => {
      const style = getComputedStyle(el);

      if (
        style.position === "fixed" &&
        parseInt(style.zIndex || "0") > 1000
      ) {
        el.style.display = "none";
      }
    });
  }

  // -----------------------------
  // SAFE INIT
  // -----------------------------
  function initUIFix() {
    enableSafeUI();
    removeBlockingLayers();
    killFixedBlockers();
  }

  document.addEventListener("DOMContentLoaded", initUIFix);

  // backup safety trigger (in case scripts load late)
  setTimeout(initUIFix, 800);

})();
