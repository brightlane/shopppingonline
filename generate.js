
// ================================
// 🚀 SEO PRODUCT GENERATOR ENGINE v2
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
// 🧠 ASIN DEDUPLICATION SYSTEM (IMPORTANT FIX)
// ================================

function removeDuplicateASINs(products = []) {
  const seen = new Set();
  const clean = [];

  for (const p of products) {
    if (!p.asin) continue;

    const asin = p.asin.toUpperCase();

    if (seen.has(asin)) continue;

    seen.add(asin);
    clean.push({ ...p, asin });
  }

  return clean;
}

// ================================
// 🔗 AMAZON SAFE LINK (FALLBACK PROTECTED)
// ================================

function amazonLink(asin) {
  if (!asin || typeof asin !== "string") {
    return "https://www.amazon.com/?tag=brightlane201-20";
  }

  const clean = asin.toUpperCase().trim();

  if (clean.length !== 10) {
    return "https://www.amazon.com/?tag=brightlane201-20";
  }

  return `https://www.amazon.com/dp/${clean}?tag=brightlane201-20`;
}

// ================================
// 🧱 PRODUCT NORMALIZER
// ================================

function normalizeProduct(p) {
  return {
    title: p.title || "Best Amazon Product",
    asin: p.asin || "",
    price: p.price || "0.00",
    rating: p.rating || "4.5",
    reviews: p.reviews || "1K+",
    image: p.image || "https://via.placeholder.com/300",
    description: p.description || "High-quality product selected for performance and value.",
    category: p.category || "general"
  };
}

// ================================
// 🧠 SEO TITLE GENERATOR
// ================================

function generateSEOTitle(category) {
  const map = {
    vacuum: "Best Vacuum Cleaners 2026",
    coffee: "Best Coffee Makers 2026",
    stanley: "Best Stanley Tumblers 2026",
    acne_patch: "Best Acne Patches 2026",
    ring_light: "Best Ring Lights for Phone 2026"
  };

  return map[category] || "Best Products 2026";
}

// ================================
// 🎨 PRODUCT CARD RENDERER
// ================================

function productCard(p, index) {
  const link = amazonLink(p.asin);

  return `
  <div style="
    background:#fff;
    border-radius:16px;
    padding:18px;
    margin:16px 0;
    display:flex;
    gap:16px;
    box-shadow:0 10px 30px rgba(0,0,0,0.08);
  ">

    <a href="${link}" target="_blank">
      <img src="${p.image}"
        style="width:160px;height:160px;object-fit:cover;border-radius:12px;" />
    </a>

    <div style="flex:1;">

      <h2 style="font-size:18px;margin:0 0 8px;">
        ${index + 1}. ${escapeHTML(p.title)}
      </h2>

      <p style="font-size:13px;color:#555;">
        ${escapeHTML(p.description)}
      </p>

      <p style="font-weight:700;color:#16a34a;">
        $${p.price}
      </p>

      <p style="font-size:13px;color:#444;">
        ⭐ ${p.rating} (${p.reviews})
      </p>

      <a href="${link}" target="_blank"
        style="
          display:inline-block;
          margin-top:10px;
          padding:10px 14px;
          background:linear-gradient(135deg,#ff7a18,#ff3d00);
          color:#fff;
          border-radius:10px;
          text-decoration:none;
          font-weight:700;
        ">
        🛒 View on Amazon
      </a>

    </div>
  </div>
  `;
}

// ================================
// 🚀 MAIN RENDER FUNCTION
// ================================

function renderProducts(products = []) {
  const container = document.getElementById("products");

  if (!container) return;

  // STEP 1: CLEAN DATA
  let clean = products.map(normalizeProduct);

  // STEP 2: REMOVE DUPLICATES (IMPORTANT FIX)
  clean = removeDuplicateASINs(clean);

  // STEP 3: RENDER
  container.innerHTML = clean.map(productCard).join("");
}

// ================================
// 📊 SCHEMA INJECTION (SEO BOOST)
// ================================

function injectSchema(product) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.image,
    "description": product.description,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": product.price,
      "availability": "https://schema.org/InStock"
    }
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}
