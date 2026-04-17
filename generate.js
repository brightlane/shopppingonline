
// ================================
// 🚀 PRODUCT PAGE GENERATOR (CLEAN + SEO + SAFE)
// ================================

function escapeHTML(str = "") {
  return str
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ================================
// 🧠 SAFE PRODUCT CARD
// ================================

function productCard(p, index) {
  const link = window.amazonLink(p.asin);

  const title = escapeHTML(p.title || "Untitled Product");
  const image = p.image || "https://via.placeholder.com/300";
  const price = p.price ? `$${p.price}` : "Check Price";
  const rating = p.rating || "4.5";
  const reviews = p.reviews || "1K+";

  const categoryLink = p.category
    ? `<a href="/${p.category}-hub.html" style="color:#2563eb;text-decoration:none;">More ${p.category} →</a>`
    : "";

  return `
  <div style="
    background:#fff;
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 10px 30px rgba(0,0,0,0.08);
    margin:20px 0;
    display:flex;
    flex-wrap:wrap;
    transition:0.2s ease;
  ">

    <!-- IMAGE -->
    <a href="${link}" target="_blank" style="flex:0 0 220px;">
      <img src="${image}"
        alt="${title}"
        style="width:220px;height:220px;object-fit:cover;display:block;"
        loading="lazy"
      />
    </a>

    <!-- CONTENT -->
    <div style="flex:1;padding:18px;min-width:250px;">

      <h2 style="margin:0 0 8px 0;font-size:18px;">
        ${index + 1}. ${title}
      </h2>

      <p style="margin:0 0 10px 0;color:#555;font-size:14px;">
        ${p.description || "High-quality product selected for performance, durability, and value."}
      </p>

      <p style="margin:8px 0;font-size:13px;color:#444;">
        ⭐ ${rating} (${reviews} reviews)
      </p>

      <p style="margin:8px 0;font-weight:700;color:#16a34a;">
        ${price}
      </p>

      <!-- CTA -->
      <a href="${link}" target="_blank"
        onclick="trackAffiliateClick('${p.asin}', '${p.id || ""}')"
        style="
          display:inline-block;
          padding:12px 16px;
          background:linear-gradient(135deg,#ff7a18,#ff3d00);
          color:#fff;
          border-radius:10px;
          text-decoration:none;
          font-weight:700;
          margin-top:10px;
        ">
        🛒 View on Amazon
      </a>

      <!-- INTERNAL SEO LINK -->
      <div style="margin-top:10px;font-size:13px;">
        ${categoryLink}
      </div>

    </div>
  </div>
  `;
}

// ================================
// 📦 PRODUCT PAGE RENDERER
// ================================

function renderProducts(products = []) {
  const container = document.getElementById("products");

  if (!container) {
    console.error("Missing #products container");
    return;
  }

  container.innerHTML = products.map(productCard).join("");
}

// ================================
// 🔎 SIMPLE SEO HELPER (OPTIONAL)
// ================================

function injectProductSchema(product) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.image,
    "description": product.description,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": product.price || "0",
      "availability": "https://schema.org/InStock"
    }
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}
