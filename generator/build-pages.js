const fs = require("fs");
const path = require("path");

// Load feed
const feedPath = path.join(__dirname, "../feed.json");

if (!fs.existsSync(feedPath)) {
  console.log("❌ feed.json not found. Run feeder.js first.");
  process.exit(1);
}

const feed = JSON.parse(fs.readFileSync(feedPath, "utf-8"));

// Ensure output directory exists
const outputDir = path.join(__dirname, "../");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Simple HTML template (you can upgrade later)
function generateHTML(item) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${item.title}</title>
  <meta name="description" content="${item.description}">
</head>
<body>

  <h1>${item.title}</h1>

  <p>${item.description}</p>

  <p>Keyword focus: <strong>${item.keyword}</strong></p>

  <a href="https://www.amazon.com/s?k=${encodeURIComponent(item.keyword)}" target="_blank">
    View products on Amazon
  </a>

</body>
</html>`;
}

// Build pages
let count = 0;

feed.forEach(item => {
  const filePath = path.join(outputDir, item.url);

  fs.writeFileSync(filePath, generateHTML(item));
  console.log(`✅ Generated: ${item.url}`);
  count++;
});

console.log(`🚀 Done. ${count} pages generated.`);
