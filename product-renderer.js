const AFFILIATE_TAG = "brightlane201-20";

/**
 * Build safe Amazon link (NEVER loses affiliate tag)
 */
function buildAmazonUrl(asin) {
  return `https://www.amazon.com/dp/${asin}/?tag=${AFFILIATE_TAG}`;
}

/**
 * Create Amazon-style product card
 */
function createProductCard(product) {
  return `
    <div class="card">

      <h2>${product.title}</h2>

      <div style="color:#ffa41c; font-size:14px; margin:6px 0;">
        ⭐ ${product.rating} (${product.reviews.toLocaleString()} reviews)
      </div>

      <div style="font-weight:bold; color:#b12704; margin-bottom:8px;">
        ${product.price}
      </div>

      <p style="color:#565959;">
        ${product.description}
      </p>

      <a class="btn"
         href="${buildAmazonUrl(product.asin)}"
         target="_blank"
         rel="noopener noreferrer sponsored">
         View on Amazon
      </a>

    </div>
  `;
}

/**
 * Render product list into a grid
 */
function renderProducts(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = products.map(createProductCard).join("");
}
