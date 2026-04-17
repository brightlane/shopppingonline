/**
* link-fix.js
* ============================================================
* Drop this file into your GitHub Pages repo root and add:
*  <script src="/shopppingonline/link-fix.js"></script>
* to every HTML page (just before </body>).
*
* What it fixes
* -------------
* 1. Removes any <base> tag that hijacks external link targets.
* 2. Overrides any JS click-interceptors by attaching a
*    capture-phase listener that forces external links
*    (amazon.com, etc.) to open correctly via window.open.
* 3. Rewrites href attributes that accidentally became
*    relative (e.g. "/dp/B01N..." instead of full Amazon URL).
* ============================================================
*/

(function () {
  "use strict";

  /* ── 1. Kill any <base> tag that re-roots external URLs ── */
  document.querySelectorAll("base").forEach(function (base) {
    base.parentNode.removeChild(base);
  });

  /* ── 2. Fix malformed/relative Amazon hrefs ── */
  var AMAZON_PATH_RE = /^\/dp\//i;          // accidentally relative
  var AMAZON_FULL_RE = /^https?:\/\/(www\.)?amazon\./i;

  document.querySelectorAll("a[href]").forEach(function (a) {
    var href = a.getAttribute("href");

    // Relative Amazon path → prepend full origin
    if (AMAZON_PATH_RE.test(href)) {
      a.setAttribute("href", "https://www.amazon.com" + href);
      href = a.getAttribute("href");
    }

    // All external links: ensure target="_blank" + rel safety
    if (AMAZON_FULL_RE.test(href) || /^https?:\/\//i.test(href)) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    }
  });

  /* ── 3. Capture-phase click guard ─────────────────────────
    Fires BEFORE any existing listeners.
    If the link is an Amazon/external URL, we open it
    ourselves and stop propagation so no other handler
    can swallow it and cause a 404.                        */
  document.addEventListener(
    "click",
    function (e) {
      var anchor = e.target.closest("a[href]");
      if (!anchor) return;

      var href = anchor.getAttribute("href");
      if (!href) return;

      // Only intercept full external URLs
      if (/^https?:\/\//i.test(href)) {
        e.stopImmediatePropagation(); // kill any other listeners
        e.preventDefault();
        window.open(href, "_blank", "noopener,noreferrer");
      }
    },
    true  // ← capture phase — runs first
  );

})();
