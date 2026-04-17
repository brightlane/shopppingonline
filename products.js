window.AFFILIATE_TAG = window.AFFILIATE_TAG || "brightlane201-20";

/**
 * SAFE AMAZON LINK BUILDER
 * prevents broken links + ensures affiliate tag always applied
 */
function amazonLink(asin) {
  if (!asin || typeof asin !== "string" || asin.length < 5) {
    console.warn("Invalid ASIN:", asin);
    return "#";
  }

  return `https://www.amazon.com/dp/${asin}?tag=${window.AFFILIATE_TAG}`;
}

/**
 * MASTER PRODUCT DATABASE
 * RULE: ONE ASIN = ONE PRODUCT ONLY (prevents duplicates)
 */
window.PRODUCTS = [
  {
    id: "vacuum-001",
    name: "Ultra Clean Vacuum Pro 2026",
    category: "vacuum",
    asin: "B0VACUUM001",
    image: "https://via.placeholder.com/600x400?text=Vacuum+Cleaner",
    description: "High suction vacuum cleaner for home and car deep cleaning.",
  },
  {
    id: "coffee-001",
    name: "Barista Pro Coffee Maker",
    category: "coffee",
    asin: "B0COFFEE001",
    image: "https://via.placeholder.com/600x400?text=Coffee+Maker",
    description: "Premium coffee machine for espresso and drip coffee lovers.",
  },
  {
    id: "ring-001",
    name: "Creator Ring Light Pro",
    category: "ring-light",
    asin: "B0RINGLIGHT01",
    image: "https://via.placeholder.com/600x400?text=Ring+Light",
    description: "Perfect lighting setup for creators, TikTok, YouTube, and Zoom.",
  },
  {
    id: "acne-001",
    name: "Fast Heal Acne Patch",
    category: "skincare",
    asin: "B0ACNEPATCH01",
    image: "https://via.placeholder.com/600x400?text=Acne+Patch",
    description: "Hydrocolloid acne patches for fast skin recovery overnight.",
  },
  {
    id: "stanley-001",
    name: "Stanley Quencher Tumbler 1.2L",
    category: "lifestyle",
    asin: "B0STANLEY001",
    image: "https://via.placeholder.com/600x400?text=Stanley+Tumbler",
    description: "Viral insulated tumbler for hot and cold drinks all day.",
  }
];

/**
 * GET PRODUCT BY ID (safe lookup)
 */
window.getProductById = function (id) {
  return window.PRODUCTS.find(p => p.id === id);
};

/**
 * GET PRODUCT BY ASIN (fix duplicate issues)
 */
window.getProductByAsin = function (asin) {
  return window.PRODUCTS.find(p => p.asin === asin);
};

/**
 * GENERATE SAFE AMAZON LINK
 */
window.buildAmazonLink = function (asin) {
  return amazonLink(asin);
};

/**
 * CLICK TRACKING (safe, non-blocking)
 */
window.trackProductClick = function (id, asin) {
  console.log("Tracked:", id, asin);
};
