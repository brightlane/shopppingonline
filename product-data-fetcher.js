const axios = require('axios');

const PRODUCT_DATA_FETCHER = {
  apiUrl: 'https://api.example.com/products',  // Change to your actual product data API

  log: function (msg) {
    console.log("[PRODUCT DATA FETCHER]", msg);
  },

  /**
   * Fetch product details from an API or database
   * @param {string} asin - The Amazon Standard Identification Number (ASIN)
   */
  fetchProductData: async function (asin) {
    try {
      this.log(`Fetching product data for ASIN: ${asin}`);
      const response = await axios.get(`${this.apiUrl}/${asin}`);
      if (response.status === 200) {
        return response.data;  // Assuming the response contains the product data
      } else {
        this.log(`⚠️ Failed to fetch product data for ASIN: ${asin}`);
        return this.getDefaultProductData(asin);
      }
    } catch (error) {
      this.log(`❌ Error fetching product data for ASIN: ${asin} - ${error.message}`);
      return this.getDefaultProductData(asin);  // Fallback to default product data
    }
  },

  /**
   * Generate default data in case of a failed fetch
   * @param {string} asin - The ASIN of the product
   */
  getDefaultProductData: function (asin) {
    return {
      asin: asin,
      title: "Unknown Product",
      description: "No description available",
      price: "N/A",
      image: "https://example.com/default-image.jpg",  // Fallback image URL
    };
  },

  /**
   * Fetch multiple product details and normalize them into a consistent format
   * @param {Array} asinList - Array of ASINs for products to fetch
   */
  fetchMultipleProducts: async function (asinList) {
    const productPromises = asinList.map(asin => this.fetchProductData(asin));
    const products = await Promise.all(productPromises);
    this.log(`✅ Fetched data for ${products.length} products`);
    return products;
  },

  /**
   * Normalize and clean fetched product data (map to internal format)
   * @param {Array} products - Array of raw product data
   */
  normalizeProducts: function (products) {
    return products.map(product => ({
      title: product.title || "Untitled Product",
      asin: product.asin,
      price: product.price || "N/A",
      description: product.description || "No description available",
      image: product.image || "https://example.com/default-image.jpg",
    }));
  }
};

module.exports = PRODUCT_DATA_FETCHER;
