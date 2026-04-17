const crypto = require("crypto");
const axios = require("axios");

const ACCESS_KEY = process.env.AMAZON_ACCESS_KEY;
const SECRET_KEY = process.env.AMAZON_SECRET_KEY;
const TAG = process.env.AMAZON_TAG;

function sign(payload, secret) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

async function fetchProduct(asin) {
  const endpoint = "https://webservices.amazon.com/paapi5/getitems";

  const body = {
    ItemIds: [asin],
    Resources: [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "Offers.Listings.Price"
    ],
    PartnerTag: TAG,
    PartnerType: "Associates",
    Marketplace: "www.amazon.com"
  };

  try {
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
      link: `https://www.amazon.com/dp/${asin}?tag=${TAG}`
    };

  } catch (e) {
    console.log("PA-API FAIL:", asin);
    return null;
  }
}

module.exports = { fetchProduct };
