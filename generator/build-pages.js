const fs = require("fs");

if (!fs.existsSync("data.json")) {
  console.error("Missing data.json");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

// Create ONE strong page instead of spam pages
const title = "Printify & POD Guide Hub";

const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta name="description" content="Complete guide to Print on Demand and Printify strategies">
</head>
<body>
  <h1>${title}</h1>

  <h2>Latest Data</h2>
  <pre>${JSON.stringify(data, null, 2)}</pre>

  <h2>Guides</h2>
  <ul>
    <li>Print on Demand Strategy</li>
    <li>Best POD Niches</li>
    <li>How to Start POD Business</li>
  </ul>
</body>
</html>
`;

fs.writeFileSync("index.html", html);

console.log("Generated homepage");
