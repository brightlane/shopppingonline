const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "dist");
const PRODUCTS = path.join(__dirname, "products-source.json");

/**
 * 🧠 CHECK IF FILE EXISTS
 */
function exists(file) {
  return fs.existsSync(path.join(DIST, file));
}

/**
 * 🔍 BASIC VALIDATION RULES
 */
function validate() {

  console.log("\n🔍 RUNNING DEPLOY VALIDATION...\n");

  const requiredFiles = [
    "index.html",
    "coffee-hub.html"
  ];

  let ok = true;

  // check required outputs
  requiredFiles.forEach(file => {
    if (!exists(file)) {
      console.error("❌ Missing:", file);
      ok = false;
    } else {
      console.log("✅ Found:", file);
    }
  });

  // check product data integrity
  const products = JSON.parse(fs.readFileSync(PRODUCTS, "utf-8"));

  const bad = products.filter(p =>
    !p.asin ||
    !p.image ||
    typeof p.asin !== "string" ||
    p.asin.length < 8
  );

  if (bad.length > 0) {
    console.error("\n❌ INVALID PRODUCTS FOUND:", bad.length);
    ok = false;
  } else {
    console.log("\n✅ All products valid");
  }

  return ok;
}

/**
 * 🚀 RUN DEPLOY GUARD
 */
function run() {

  const ok = validate();

  if (!ok) {
    console.log("\n🛑 DEPLOY BLOCKED — FIX ERRORS FIRST");
    process.exit(1);
  }

  console.log("\n🚀 DEPLOY APPROVED — SAFE TO PUBLISH");
}

run();
