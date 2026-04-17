// ===============================
// 🔒 AMAZON LINK BUILDER (HARDENED)
// Prevents 404s + invalid ASINs + broken tracking
// ===============================

window.AFFILIATE_TAG = window.AFFILIATE_TAG || "brightlane201-20";

// -------------------------------
// ASIN VALIDATOR (CRITICAL)
// -------------------------------
function isValidASIN(asin) {
  return typeof asin === "string" && /^[A-Z0-9]{10}$/.test(asin);
}

// -------------------------------
// CLEAN ASIN INPUT
// fixes lowercase, spaces, junk
// -------------------------------
function cleanASIN(asin) {
  if (!asin) return null;
  return String(asin).trim().toUpperCase();
}

// -------------------------------
// SAFE AMAZON LINK BUILDER
// NEVER allows broken links to escape
// -------------------------------
window.amazonLink = function (asin) {
  const clean = cleanASIN(asin);

  if (!isValidASIN(clean)) {
    console.warn("❌ BLOCKED INVALID ASIN:", asin);
    return null; // prevents broken Amazon redirects
  }

  return `https://www.amazon.com/dp/${clean}?tag=${window.AFFILIATE_TAG}`;
};

// -------------------------------
// SAFE CLICK BUILDER (HTML HELPER)
// -------------------------------
window.amazonButton = function (asin, label = "View on Amazon") {
  const url = window.amazonLink(asin);

  if (!url) {
    return `<span style="color:red;">Product unavailable</span>`;
  }

  return `
    <a href="${url}"
       target="_blank"
       rel="nofollow sponsored noopener"
       style="
         display:inline-block;
         padding:12px 18px;
         background:#111;
         color:#fff;
         border-radius:8px;
         text-decoration:none;
         font-weight:600;
       ">
      ${label}
    </a>
  `;
};

// -------------------------------
// DEBUG TRACKING (optional)
// -------------------------------
window.trackAmazonClick = function (asin) {
  console.log("📦 Amazon click:", asin);

  if (!isValidASIN(cleanASIN(asin))) {
    console.error("❌ BAD ASIN CLICK BLOCKED");
  }
};
