// product-renderer.js — SAFE AMAZON PRODUCT RENDERER
// Goal: NO internal links, NO relative routes, NO 404 chains

const AFFILIATE_TAG = "brightlane201-20";

// -----------------------------
// ASIN VALIDATION
// -----------------------------
function isValidASIN(asin) {
  return /^[A-Z0-9]{10}$/i.test(asin);
}

function cleanASIN(asin) {
  if (!asin) return null;

  const cleaned = String(asin)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  return isValidASIN(cleaned) ? cleaned : null;
}

// -----------------------------
// AMAZON URL BUILDER (SOURCE OF TRUTH)
// -----------------------------
function buildAmazonUrl(asin) {
  const clean = cleanASIN(asin);

  if (!clean) {
    // NEVER allow broken navigation
    return "https://www.amazon.com";
  }

  return `https://www.amazon.com/dp/${clean}/?tag=${AFFILIATE_TAG}`;
}

// -----------------------------
// MAIN RENDER FUNCTION
// -----------------------------
export function renderProductCard(product) {
  if (!product) return "";

  const url = buildAmazonUrl(product.asin);

  return `
    <div class="card">
      <h2>${product.title || "Product"}</h2>

      <div class="rating">
        ${product.rating || "★★★★★"}
      </div>

      <p class="price">${product.price || ""}</p>

      <p>${product.description || ""}</p>

      <!-- IMPORTANT: DIRECT AMAZON LINK ONLY -->
      <a class="btn"
         href="${url}"
         target="_blank"
         rel="noopener noreferrer nofollow sponsored">
         View on Amazon
      </a>
    </div>
  `;
}

// -----------------------------
// BULK RENDER (HUB PAGES)
// -----------------------------
export function renderProductGrid(products = []) {
  if (!Array.isArray(products)) return "";

  return `
    <div class="product-grid">
      ${products.map(renderProductCard).join("")}
    </div>
  `;
}

// -----------------------------
// SAFE CLICK FALLBACK (optional JS hook)
// -----------------------------
export function attachSafeClicks() {
  document.addEventListener("click", (e) => {
    const el = e.target.closest("a[data-asin]");

    if (!el) return;

    const asin = el.getAttribute("data-asin");
    const url = buildAmazonUrl(asin);

    if (!url.includes("amazon.com")) return;

    e.preventDefault();
    window.location.href = url;
  });
}
