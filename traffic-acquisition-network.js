/**
 * traffic-acquisition-network.js
 * AAC External Distribution Layer
 * Pushes content into syndication channels for traffic generation
 */

const fs = require("fs");
const path = require("path");

// === CONFIG ===
const OUTPUT_LOG = path.join(__dirname, "cache/traffic-log.json");

// === ENTRY POINT ===
function runTrafficNetwork() {
  console.log("🌐 Running Traffic Acquisition Network...");

  const content = loadGeneratedContent();

  const distributionPlan = buildDistributionPlan(content);

  executeDistribution(distributionPlan);

  saveLog(distributionPlan);

  console.log("✅ Traffic network cycle complete");
}

// === LOAD GENERATED CONTENT ===
function loadGeneratedContent() {
  const distPath = path.join(__dirname, "dist");

  if (!fs.existsSync(distPath)) return [];

  const files = fs.readdirSync(distPath);

  return files
    .filter(f => f.endsWith(".html"))
    .map(file => {
      const content = fs.readFileSync(path.join(distPath, file), "utf8");

      return {
        file,
        title: extractTitle(content),
        url: `https://yourdomain.com/${file}`
      };
    });
}

// === EXTRACT TITLE ===
function extractTitle(html) {
  const match = html.match(/<title>(.*?)<\/title>/);
  return match ? match[1] : "Untitled";
}

// === BUILD DISTRIBUTION PLAN ===
function buildDistributionPlan(content) {
  return content.map(item => {
    return {
      ...item,
      channels: [
        "rss",
        "social_stub",
        "web_pings",
        "content_syndication"
      ]
    };
  });
}

// === EXECUTE DISTRIBUTION ===
function executeDistribution(plan) {
  plan.forEach(item => {
    console.log(`📡 Distributing: ${item.title}`);

    pushToRSS(item);
    pushToSocialStub(item);
    pingWeb(item);
  });
}

// === RSS PUSH (SIMULATED) ===
function pushToRSS(item) {
  logEvent("rss", item);
}

// === SOCIAL PUSH (SIMULATED HOOK) ===
function pushToSocialStub(item) {
  logEvent("social", item);
}

// === WEB PING (SIMULATED) ===
function pingWeb(item) {
  logEvent("ping", item);
}

// === LOG EVENT ===
function logEvent(type, item) {
  const entry = {
    type,
    title: item.title,
    url: item.url,
    timestamp: Date.now()
  };

  console.log(`   → ${type.toUpperCase()} pushed: ${item.title}`);
}

// === SAVE LOG ===
function saveLog(plan) {
  fs.mkdirSync(path.dirname(OUTPUT_LOG), { recursive: true });

  fs.writeFileSync(
    OUTPUT_LOG,
    JSON.stringify({
      timestamp: Date.now(),
      items: plan.length
    }, null, 2)
  );
}

// === EXPORTS ===
module.exports = {
  runTrafficNetwork
};

// === AUTO RUN ===
if (require.main === module) {
  runTrafficNetwork();
}
