const fs = require("fs");
console.log("🚀 FULL NUCLEAR GENERATOR - COMPETITION CRUSHER");

// CONFIG
const AFFILIATE_TAG = "brightlane201-20";
const LANGUAGES = ['en','es','de'];
const PAGE_TYPES = ['best','top','ultimate','vs','guide','review','2026','buying','compared','showdown','battle','ranking','picks','choices','ranked'];

// MASTER CATEGORIES (scale to 100+)
const CATEGORIES = {
  vacuum: {name: "Vacuum Cleaners", keywords: ["cordless vacuum","robot vacuum","upright vacuum"]},
  coffee: {name: "Coffee Makers", keywords: ["single serve","espresso machine","drip coffee"]}
};

// HELPERS
function escapeHTML(str) { 
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); 
}
function slugify(str) { 
  return str.toLowerCase().replace(/[^\w\s-]/g,'').replace(/[\s_-]+/g,'-').replace(/^-+|-+$/g,''); 
}

function loadProducts(cat) {
  try {
    return JSON.parse(fs.readFileSync(`./products-${cat}.json`,'utf8'));
  } catch(e) {
    console.log(`⚠️ Missing products-${cat}.json`);
    return DUMMY_PRODUCTS[cat] || [];
  }
}

// FALLBACK DUMMY DATA (works WITHOUT JSON files)
const DUMMY_PRODUCTS = {
  vacuum: [
    {title:"Dyson V15 Detect",asin:"B08N5LN61C",image:"https://m.media-amazon.com/images/I/81bA5hK5gZL.jpg",price:"749",rating:"4.7",reviews:"12,500",description:"Best overall vacuum 2026"},
    {title:"Shark IQ Robot",asin:"B08LF6X1RX",image:"https://m.media-amazon.com/images/I/shark.jpg",price:"450",rating:"4.5",reviews:"8,500",description:"Hands-free cleaning"},
    {title:"Roomba j7+",asin:"B09B8WFFGL",image:"https://m.media-amazon.com/images/I/roomba.jpg",price:"799",rating:"4.6",reviews:"6,200",description:"AI obstacle avoidance"}
  ],
  coffee: [
    {title:"Nespresso Vertuo",asin:"B08G9K1234",image:"https://m.media-amazon.com/images/I/nespresso.jpg",price:"169",rating:"4.6",reviews:"21,000",description:"Perfect espresso at home"},
    {title:"Keurig K-Supreme",asin:"B08HJK5678",image:"https://m.media-amazon.com/images/I/keurig.jpg",price:"129",rating:"4.4",reviews:"34,000",description:"Fast single-serve coffee"},
    {title:"Breville Barista",asin:"B07XYZ7890",image:"https://m.media-amazon.com/images/I/breville.jpg",price:"699",rating:"4.8",reviews:"4,200",description:"Pro espresso machine"}
  ]
};

function productCard(p,i) {
  return `
<div style="background:#fff;padding:25px;margin:20px 0;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
  <h3 style="margin:0 0 10px 0;">#${i+1} ${escapeHTML(p.title)}</h3>
  <img src="${p.image}" width="220" style="border-radius:8px;" loading="lazy">
  <p>${escapeHTML(p.description)}</p>
  <p><strong>$${p.price} • ${p.rating}⭐ (${p.reviews} reviews)</strong></p>
  <a href="https://amazon.com/dp/${p.asin}?tag=${AFFILIATE_TAG}" 
     style="background:#ff9900;color:white;padding:12px 24px;border-radius:8px;display:inline-block;text-decoration:none;font-weight:600;"
     target="_blank">🛒 Buy on Amazon</a>
</div>`;
}

function comparisonTable(products) {
  const top3 = products.slice(0,3);
  return `
<div style="background:#f0f8ff;padding:25px;border-radius:12px;margin:30px 0;">
  <h3>Quick Comparison (Top 3)</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr style="background:#3b82f6;color:white;">
      <th style="padding:12px;">Model</th>
      <th style="padding:12px;">Price</th>
      <th style="padding:12px;">Rating</th>
    </tr>
    ${top3.map(p=>`
    <tr style="border-bottom:1px solid #eee;">
      <td style="padding:12px;font-weight:500;">${escapeHTML(p.title)}</td>
      <td style="padding:12px;">$${p.price}</td>
      <td style="padding:12px;">${p.rating}⭐</td>
    </tr>`).join('')}
  </table>
</div>`;
}

// MAIN GENERATION
let pageCount = 0;
const generatedFiles = [];

Object.entries(CATEGORIES).forEach(([slug,category]) => {
  let products = loadProducts(slug);
  if (!products.length) products = DUMMY_PRODUCTS[slug];
  
  if (products.length === 0) return;
  
  LANGUAGES.forEach(lang => {
    PAGE_TYPES.forEach(type => {
      // Shuffle for variety
      const pageProducts = products.sort(()=>Math.random()-0.5).slice(0,8);
      
      const filename = `${type}-${slugify(category.name)}-${lang}.html`;
      const content = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${type.charAt(0).toUpperCase()+type.slice(1)} ${category.name} 2026 | Expert Reviews</title>
  <meta name="description" content="Best ${category.name.toLowerCase()} 2026 - ${products.length} models tested. ${category.keywords.join(', ')}">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:1000px;margin:auto;padding:20px;background:#f8fafc;">
  
  <header style="text-align:center;padding:40px 20px;background:white;border-radius:20px;margin-bottom:40px;box-shadow:0 10px 40px rgba(0,0,0,0.1);">
    <h1 style="font-size:2.5rem;color:#1a202c;margin:0;">${type.toUpperCase()} ${category.name} 2026</h1>
    <p style="color:#718096;font-size:1.1rem;margin:20px 0;">Tested & Ranked by Experts | ${pageProducts.length} Models Compared</p>
  </header>

  <main style="background:white;padding:40px;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,0.1);">
    ${comparisonTable(pageProducts)}
    
    <div style="display:grid;gap:30px;">
      ${pageProducts.map((p,i)=>productCard(p,i+1)).join('\n')}
    </div>
    
    <div style="background:#f7fafc;padding:30px;border-radius:16px;margin-top:40px;text-align:center;">
      <h3>❓ Frequently Asked Questions</h3>
      <details style="margin:20px 0;background:white;padding:20px;border-radius:12px;">
        <summary style="cursor:pointer;font-weight:600;">What's the best ${category.name.toLowerCase()} for 2026?</summary>
        <p style="margin:15px 0 0 0;">Our top pick balances price, performance, and real customer reviews. See comparison above.</p>
      </details>
    </div>
    
    <div style="text-align:center;margin-top:50px;padding-top:30px;border-top:2px solid #e2e8f0;">
      <p style="color:#718096;font-size:14px;">
        <strong>As an Amazon Associate we earn from qualifying purchases.</strong><br>
        <a href="index.html" style="color:#4299e1;">← All Categories</a>
      </p>
    </div>
  </main>
</body>
</html>`;
      
      fs.writeFileSync(filename, content);
      pageCount++;
      generatedFiles.push(filename);
      console.log(`📄 ${pageCount}: ${filename}`);
    });
  });
});

// LANDING PAGES
fs.writeFileSync('index.html', `<!DOCTYPE html>
<html><head><title>🏆 Best Products 2026 - Expert Reviews</title><meta name="viewport" content="width=device-width"></head>
<body style="font-family:system-ui;background:#f7fafc;padding:40px;">
<h1 style="text-align:center;font-size:3rem;color:#2d3748;">Best Products 2026</h1>
<p style="text-align:center;color:#718096;font-size:1.3rem;">${pageCount} Expert Review Pages | Updated April 2026</p>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:30px;max-width:1200px;margin:60px auto;">
${Object.values(CATEGORIES).map(cat=>`
  <div style="background:white;padding:40px;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.1);text-align:center;">
    <h2 style="color:#2d3748;font-size:1.8rem;margin-bottom:20px;">${cat.name}</h2>
    <a href="best-${slugify(cat.name)}-en.html" style="display:block;padding:15px 30px;background:#4299e1;color:white;border-radius:12px;font-weight:600;margin-bottom:10px;">🇺🇸 View English Reviews</a>
    <a href="best-${slugify(cat.name)}-es.html" style="display:block;padding:15px 30px;background:#f56565;color:white;border-radius:12px;font-weight:600;margin-bottom:10px;">🇪🇸 Ver Español</a>
  </div>`).join('')}
</div>
</body></html>`);

// SEO INFRASTRUCTURE
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${generatedFiles.map(f=>`<url><loc>${f}</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>`).join('\n')}
<url><loc>index.html</loc><priority>1.0</priority></url>
</urlset>`;
fs.writeFileSync('sitemap.xml', sitemap);

fs.writeFileSync('robots.txt', `User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml`);

console.log(`
💥 NUCLEAR DOMINATION COMPLETE!
📊 ${pageCount} SEO pages generated
📁 Files: index.html + sitemap.xml + robots.txt + ${pageCount} category pages
🚀 Deploy HTML → Submit sitemap → Rank #1 "best vacuum 2026"
`);
