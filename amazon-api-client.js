// Example: compliant code pattern (Node.js with HTTP client)
const https = require('https');

/**
 * Make a single, rate‑limited API call to Amazon's official endpoint.
 * Replace this with actual Amazon Product Advertising API / SP-API SDK calls.
 */
function fetchProductInfo(apiConfig, productId) {
  const options = {
    hostname: apiConfig.hostname, // e.g., "webservices.amazon.com"
    path: `/paapi5/getitems?ItemId=${productId}&ApiKey=${apiConfig.apiKey}`,
    method: 'GET',
    headers: {
      'User-Agent': 'PalmoKid-Compliant-Tool/1.0 (+https://yourdomain.com)', // identify your tool
      'x-amz-date': new Date().toISOString().replace(/[:-]|\.\d{3}/g, ''), // fill with real AWS‑style headers
      'x-amz-security-token': '', // if using AWS‑style auth
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Usage (with throttling to avoid hammering)
const API_CONFIG = {
  hostname: 'webservices.amazon.com', // actual Amazon API hostname
  apiKey: process.env.AMAZON_API_KEY, // store in env, not in code
};

const PRODUCT_ID = 'B08N5WRWNW';

async function main() {
  try {
    // Respect rate limits (e.g., 1 request per 1–2 seconds per docs)
    const result = await fetchProductInfo(API_CONFIG, PRODUCT_ID);
    console.log('Product data:', result);
  } catch (err) {
    console.error('API error:', err.message);
  }
}

// Just one call; real code should add backoff / retry
main();
