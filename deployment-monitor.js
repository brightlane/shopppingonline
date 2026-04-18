/**
 * deployment-monitor.js
 * AAC Deployment Intelligence Layer
 * Watches system health, page decay, and triggers rebuild signals
 */

const fs = require("fs");
const path = require("path");

// === CONFIG ===
const DIST_DIR = path.join(__dirname, "dist");
const REPORT_FILE = path.join(__dirname, "cache/deploy-report.json");

// === ENTRY POINT ===
function runDeploymentMonitor() {
  console.log("📡 Running Deployment Monitor...");

  const pages = scanPages();
  const report = analyzePages(pages);

  saveReport(report);

  triggerActions(report);

  console.log("✅ Deployment Monitor Complete");
}

// === SCAN GENERATED PAGES ===
function scanPages() {
  if (!fs.existsSync(DIST_DIR)) return [];

  const files = fs.readdirSync(DIST_DIR);

  return files
    .filter(f => f.endsWith(".html"))
    .map(file => {
      const content = fs.readFileSync(path.join(DIST_DIR, file), "utf8");

      return {
        file,
        size: content.length,
        hasTitle: content.includes("<title>"),
        hasImage: content.includes("<img"),
        hasAffiliate: content.includes("amazon"),
        raw: content
      };
    });
}

// === ANALYZE SEO HEALTH ===
function analyzePages(pages) {
  const report = {
    total: pages.length,
    broken: [],
    weak: [],
    healthy: [],
    score: 0
  };

  pages.forEach(p => {
    let score = 0;

    if (p.hasTitle) score += 1;
    if (p.hasImage) score += 1;
    if (p.hasAffiliate) score += 1;
    if (p.size > 1200) score += 1;

    if (score <= 1) {
      report.broken.push(p.file);
    } else if (score === 2) {
      report.weak.push(p.file);
    } else {
      report.healthy.push(p.file);
    }

    report.score += score;
  });

  return report;
}

// === SAVE REPORT ===
function saveReport(report) {
  fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
}

// === AUTO ACTION ENGINE ===
function triggerActions(report) {
  console.log("⚠️ Broken Pages:", report.broken.length);
  console.log("⚠️ Weak Pages:", report.weak.length);
  console.log("✅ Healthy Pages:", report.healthy.length);

  // TRIGGER REBUILD SIGNAL (future orchestrator hook)
  if (report.broken.length > 0) {
    fs.writeFileSync(
      path.join(__dirname, "cache/rebuild.signal"),
      JSON.stringify({
        reason: "broken_pages_detected",
        count: report.broken.length,
        timestamp: Date.now()
      }, null, 2)
    );

    console.log("🚨 Rebuild signal triggered");
  }

  // OPTIONAL: AUTO PRIORITIZE WEAK PAGES
  if (report.weak.length > 10) {
    fs.writeFileSync(
      path.join(__dirname, "cache/seo.boost.signal"),
      JSON.stringify({
        reason: "seo_decay_detected",
        count: report.weak.length,
        timestamp: Date.now()
      }, null, 2)
    );

    console.log("📈 SEO boost signal triggered");
  }
}

// === EXPORT ===
module.exports = {
  runDeploymentMonitor
};

// === AUTO RUN ===
if (require.main === module) {
  runDeploymentMonitor();
}
