/**
 * autonomous-traffic-acquisition-layer.js
 * BrightLane Traffic Distribution Layer
 */

const fs = require("fs");
const path = require("path");

// ============================
// CONFIG
// ============================
const CONFIG = {
  pagesDir: path.join(__dirname, "pages"),
  outputDir: path.join(__dirname, "social-output"),
  feedFile: path.join(__dirname, "social-output", "rss.json")
};

// ensure output folder exists
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

// ============================
// PAGE SCANNER
// ============================
function scanPages() {
  const files = fs.readdirSync(CONFIG.pagesDir);

  return files
    .filter(f => f.endsWith(".html"))
    .map(file => {
      const content = fs.readFileSync(
        path.join(CONFIG.pagesDir, file),
        "utf-8"
      );

      return {
        file,
        title: extractTitle(content),
        slug: file.replace(".html", "")
      };
    });
}

// ============================
// TITLE EXTRACTOR
// ============================
function extractTitle(html) {
  const match = html.match(/<title>(.*?)<\/title>/i);
  return match ? match[1] : "Untitled Product";
}

// ============================
// SOCIAL POST GENERATOR
// ============================
function generateSocialPost(page) {
  return {
    platform: "generic",
    text: `🔥 New deal: ${page.title}\n👉 https://yourdomain.com/${page.file}`,
    hashtags: ["#deals", "#amazon", "#shopping", "#reviews"],
    url: `https://yourdomain.com/${page.file}`
  };
}

// ============================
// RSS FEED BUILDER
// ============================
function buildRSSFeed(pages) {
  return {
    generatedAt: new Date().toISOString(),
    items: pages.map(p => ({
      title: p.title,
      link: `https://yourdomain.com/${p.file}`,
      guid: p.slug,
      description: `Latest product deal: ${p.title}`
    }))
  };
}

// ============================
// SOCIAL OUTPUT WRITER
// ============================
function writeSocialOutputs(pages) {
  const posts = pages.map(generateSocialPost);

  fs.writeFileSync(
    path.join(CONFIG.outputDir, "posts.json"),
    JSON.stringify(posts, null, 2)
  );

  console.log(`✔ Social posts generated: ${posts.length}`);
}

// ============================
// MAIN ENGINE
// ============================
function runTrafficEngine() {
  console.log("🚀 Running Traffic Acquisition Layer...");

  const pages = scanPages();

  // RSS feed
  const rss = buildRSSFeed(pages);
  fs.writeFileSync(CONFIG.feedFile, JSON.stringify(rss, null, 2));

  // Social posts
  writeSocialOutputs(pages);

  console.log("✅ Traffic layer complete.");
}

// ============================
// AUTO RUN HOOK
// ============================
if (require.main === module) {
  runTrafficEngine();
}

// ============================
// EXPORTS
// ============================
module.exports = {
  runTrafficEngine,
  scanPages,
  buildRSSFeed,
  generateSocialPost
};
