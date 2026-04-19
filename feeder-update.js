// feeder-update.js
const fs = require('fs');
const axios = require('axios');

// Your Amazon Affiliate ID
const AMAZON_AFFILIATE_ID = 'brightlane201-20';

// List of products to be updated
const products = [
  {
    title: 'Apple AirTag',
    amazonLink: `https://www.amazon.com/dp/B0933BVK6T?tag=${AMAZON_AFFILIATE_ID}`,
    description: 'Precision item tracker using Apple Find My network.',
    review: '“Found my lost bag instantly.” — Michael R.',
    badge: 'apple'
  },
  {
    title: 'Tile Mate Tracker',
    amazonLink: `https://www.amazon.com/dp/B07W86T94V?tag=${AMAZON_AFFILIATE_ID}`,
    description: 'Bluetooth tracker compatible with iOS and Android.',
    review: '“Simple and reliable.” — Jessica L.',
    badge: 'value'
  },
  // Add more products as needed
];

// Example function to update the feed file
async function updateFeedFile() {
  const htmlTemplate = `
    <div class="header">
      <h1>🔥 BrightLane Product Comparisons</h1>
      <p>Side-by-side Amazon affiliate comparisons</p>
    </div>
    <div class="grid">
      ${products.map(product => `
        <div class="pair">
          <a class="card" href="${product.amazonLink}">
            <div class="badge ${product.badge}">${product.badge.toUpperCase()}</div>
            <div class="title">${product.title}</div>
            <div class="desc">${product.description}</div>
            <div class="review">${product.review}</div>
          </a>
        </div>
      `).join('')}
    </div>
  `;
  
  try {
    // Write the updated HTML to a file (or deploy it, e.g., to S3 or a server)
    fs.writeFileSync('index.html', htmlTemplate);
    console.log('Feed updated successfully.');
  } catch (error) {
    console.error('Error updating the feed:', error);
  }
}

updateFeedFile();
