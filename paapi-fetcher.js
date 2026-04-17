const fs = require("fs");
const path = require("path");
const axios = require("axios");
const crypto = require("crypto");

/**
 * 🔑 AMAZON PA-API CREDENTIALS
 * (you must fill these)
 */
const ACCESS_KEY = "YOUR_ACCESS_KEY";
const SECRET_KEY = "YOUR_SECRET_KEY";
const PARTNER_TAG = "brightlane201-20";
const REGION = "us-east-1";
const HOST = "webservices.amazon.com";

/**
 * 📦 INPUT / OUTPUT
 */
const INPUT = path.join(__dirname, "products-source.json");
const OUTPUT = path.join(__dirname, "products-enriched.json");

/**
 * 🧠 LOAD PRODUCTS
 */
function loadProducts() {
  return JSON.parse(fs.readFileSync(INPUT, "utf-8"));
}

/**
 * 🔥 SIGN REQUEST (PA-API REQUIREMENT)
 */
function signRequest(payload, timestamp) {
  return crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payload + timestamp)
    .digest("hex");
}

/**
 * 📡 FETCH PRODUCT FROM AMAZON PA-API
 */
async function fetchProduct(asin) {
  try {
    const endpoint =
      `https://webservices.amazon.com/paapi5/getitems`;

    const body = {
      ItemIds: [asin],
      Resources: [
        "Images.Primary.Large",
        "ItemInfo.Title",
        "Offers.Listings.Price"
      ],
      PartnerTag: PARTNER_TAG,
      PartnerType: "Associates",
      Marketplace: "www.amazon.com"
    };

    const res = await axios.post(endpoint, body, {
      headers: {
        "Content-Type": "application/json",
        "X-Amz-Target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems"
      }
    });

    const item = res.data.ItemsResult.Items[0];

    return {
      asin,
      title: item.ItemInfo.Title.DisplayValue,
      image: item.Images.Primary.Large.URL,
      price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || "",
      link: `https://www.amazon.com/dp/${asin}?tag=${PARTNER_TAG}`
    };

  } catch (err) {
    console.log("❌ PA-API failed for:", asin);
    return null;
  }
}

/**
 * 🚀 MAIN RUNNER
 */
async function run() {
  const products = loadProducts();
  const enriched = [];

  for (const p of products) {

    const data = await fetchProduct(p.asin);

    if (data) {
      enriched.push(data);
    } else {
      // fallback safe entry
      enriched.push({
        asin: p.asin,
        title: p.title,
        image: "https://via.placeholder.com/600x400?text=No+Image",
        price: "",
        link: `https://www.amazon.com/dp/${p.asin}?tag=${PARTNER_TAG}`
      });
    }
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(enriched, null, 2));

  console.log("✅ PA-API ENRICHMENT COMPLETE");
}

run();
