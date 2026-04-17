const fs = require("fs");
const path = require("path");

/**
 * 📦 YOUR BUILT SITE FOLDER
 */
const DIST = path.join(__dirname, "dist");

/**
 * 🔥 SCRIPT THAT WILL BE INJECTED INTO EVERY PAGE
 */
const INJECT_SCRIPT = `
<script>
(function () {

  const FALLBACK_IMAGE =
    "https://via.placeholder.com/600x400?text=Image+Unavailable";

  function fixAllImages() {
    document.querySelectorAll("img").forEach(img => {
      const src = img.getAttribute("src");

      if (!src || src.includes("undefined") || src.includes("null")) {
        img.src = FALLBACK_IMAGE;
      }

      img.onerror = function () {
        this.onerror = null;
        this.src = FALLBACK_IMAGE;
      };
    });
  }

  document.addEventListener("DOMContentLoaded", fixAllImages);

})();
</script>
`;

/**
 * 🧠 INJECT INTO HTML FILE
 */
function injectIntoFile(filePath) {
  let html = fs.readFileSync(filePath, "utf-8");

  // Avoid double injection
  if (html.includes("Image+Unavailable")) return;

  // Inject before </body>
  html = html.replace("</body>", `${INJECT_SCRIPT}</body>`);

  fs.writeFileSync(filePath, html, "utf-8");

  console.log("✅ Injected:", path.basename(filePath));
}

/**
 * 🚀 SCAN ALL HTML FILES IN DIST
 */
function run() {
  if (!fs.existsSync(DIST)) {
    console.error("❌ dist folder not found");
    return;
  }

  const files = fs.readdirSync(DIST);

  files.forEach(file => {
    if (file.endsWith(".html")) {
      injectIntoFile(path.join(DIST, file));
    }
  });

  console.log("🏁 AUTO INJECTION COMPLETE");
}

run();
