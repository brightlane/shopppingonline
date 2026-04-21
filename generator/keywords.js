const fs = require("fs");
const products = require("./amazon-products");
const keywords = require("./keywords");

function buildArticle(p) {
  const kw = keywords[p.category] || [];

  const content = `
# ${p.title} Review (2026 Ultimate Guide)

## Search Intent Keywords
${kw.map(k => `- ${k}`).join("\n")}

## Overview
${p.description}

## Why This Product Exists
This product solves real problems in the ${p.category} market by combining usability and affordability.

## Key Features
${p.features.map(f => `- ${f}`).join("\n")}

## Real Use Cases
- Everyday users needing reliability
- Beginners entering ${p.category}
- Budget-conscious buyers

## Pros
- Easy to use
- Affordable
- Widely available

## Cons
- Not premium tier
- Limited advanced features

## Should You Buy It?
If you are searching in the ${p.category} category and want a balance of price and performance, this is a solid option.

## Related Keywords
${kw.map(k => `• ${k}`).join("\n")}
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${p.title} Review 2026</title>
  <meta name="description" content="${p.title} review with features, pros, and buying guide">
</head>

<body>

<a href="index.html">Home</a>

<pre>${content}</pre>

<h2>Buy on Amazon</h2>
<a href="${p.affiliateUrl}" target="_blank">
Check Price
</a>

</body>
</html>
`;

  fs.writeFileSync(`${p.asin}.html`, html);
  console.log("Built:", p.asin);
}

products.forEach(buildArticle);
