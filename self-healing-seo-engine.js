const fs = require("fs");
const path = require("path");

console.log("🧠 Running SEO self-healing engine...");

const PAGES_DIR = path.join(__dirname, "pages");

// 🔥 STEP 1: AUTO-HEAL MISSING DIRECTORY
function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log("⚠ Missing folder detected:", dir);
    console.log("🔧 Auto-creating folder...");

    fs.mkdirSync(dir, { recursive: true });

    console.log("✅ Folder created:", dir);
  }
}

// 🔍 STEP 2: SAFE PAGE SCAN
function analyzePages() {
  ensureDirectory(PAGES_DIR);

  let files = [];

  try {
    files = fs.readdirSync(PAGES_DIR);
  } catch (err) {
    console.log("❌ Still unable to read pages folder");
    console.log(err.message);
    return [];
  }

  console.log(`📄 Found ${files.length} pages`);

  return files.map(file => ({
    file,
    path: path.join(PAGES_DIR, file)
  }));
}

// 🧠 STEP 3: SEO HEALING LOGIC
function runSelfHealing() {
  const pages = analyzePages();

  if (pages.length === 0) {
    console.log("⚠ No pages found — generating default structure...");

    fs.writeFileSync(
      path.join(PAGES_DIR, "index.html"),
      "<h1>Auto Generated Homepage</h1>"
    );

    console.log("✅ Default page created");
  }

  console.log("🧠 SEO Engine Complete");
}

// 🚀 RUN
runSelfHealing();
