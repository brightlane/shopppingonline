const { execSync } = require("child_process");

function run(name, cmd) {
  console.log(`\n======================`);
  console.log(`▶ Running: ${name}`);
  console.log(`======================\n`);

  try {
    execSync(cmd, { stdio: "inherit" });
    console.log(`\n✔ Success: ${name}`);
  } catch (err) {
    console.error(`\n❌ Failed step: ${name}`);
    console.error(err.message);
    process.exit(1); // stops everything cleanly
  }
}

// SAFE PIPELINE
run("Feeder", "node feeder.js");
run("Build Pages", "node generator/build-pages.js");
run("Internal Links", "node generator/internal-linker.js");
run("SEO Content", "node generator/seo-content-engine.js");
run("Ranking AI", "node generator/ranking-ai-layer.js");
run("Conversion Engine", "node generator/conversion-engine.js");
run("Self Healing", "node generator/self-healing-engine.js");
run("Traffic Engine", "node generator/traffic-engine.js");

console.log("\n🚀 FULL SYSTEM COMPLETE");
