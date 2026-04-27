const axios = require('axios');
const fs = require('fs');

async function updateFeeder() {
    try {
        console.log("Fetching latest product data...");
        // Replace the URL below with your actual data source
        const response = await axios.get('https://api.example.com/products'); 
        
        const data = response.data;
        fs.writeFileSync('products.json', JSON.stringify(data, null, 2));
        
        console.log("✅ products.json updated successfully.");
    } catch (error) {
        console.error("❌ Failed to update feeder:", error.message);
        process.exit(1); // Tells GitHub Actions the script failed
    }
}

updateFeeder();
