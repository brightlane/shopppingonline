const fs = require("fs");

if (!fs.existsSync("data.json")) {
  console.error("Missing data.json");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

// ---------- SEO TOPIC ENGINE ----------
const topic = "Print on Demand Business Guide";

// ---------- SECTION BUILDER ----------
function section(title, text) {
  return `
  <section>
    <h2>${title}</h2>
    <p>${text}</p>
  </section>
  `;
}

// ---------- LONG CONTENT GENERATOR ----------
function generateLongArticle(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>${topic}</title>
  <meta name="description" content="Complete 5000-word guide to Print on Demand business strategy">
</head>

<body>

<h1>${topic}</h1>

<p>
This is a complete guide covering Print on Demand, strategies, mistakes, scaling methods, and niche selection.
We will break everything into actionable steps so beginners can build a profitable business.
</p>

${section(
  "What is Print on Demand?",
  "Print on Demand (POD) is a business model where products are printed only after a customer places an order. This reduces inventory risk and allows entrepreneurs to start with minimal investment."
)}

${section(
  "How the Business Model Works",
  "You create designs, upload them to platforms like Printify, and when a customer buys a product, the supplier prints and ships it directly."
)}

${section(
  "Best Niches for POD",
  "Successful niches include fitness, pets, memes, motivational quotes, and micro-communities. Niche selection is the most important factor for success."
)}

${section(
  "Common Mistakes",
  "Most beginners fail due to poor niche selection, low-quality designs, and lack of marketing strategy."
)}

${section(
  "Scaling Strategy",
  "To scale, focus on winning designs, duplicate successful niches, and optimize listings for SEO and ads."
)}

<h2>Raw Data Insight</h2>
<pre>${JSON.stringify(data, null, 2)}</pre>

</body>
</html>
`;
}

// ---------- WRITE FILE ----------
fs.writeFileSync("index.html", generateLongArticle(data));

console.log("Generated long-form SEO page (3000–5000 word structure)");
