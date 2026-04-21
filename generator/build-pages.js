const fs = require("fs");

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Load data from feeder output
const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

// Example: create 1 page from API data
const title = `Todo ${data.id}`;
const slug = slugify(title);

const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
</head>
<body>
  <h1>${title}</h1>
  <p>Status: ${data.completed}</p>
  <p>User ID: ${data.userId}</p>
</body>
</html>
`;

fs.writeFileSync(`${slug}.html`, html);

console.log("Page created:", slug + ".html");
