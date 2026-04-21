const fs = require("fs");

function runIfExists(file, label) {
  if (fs.existsSync(file)) {
    console.log(`Running: ${label}`);
    require("./" + file);
  } else {
    console.log(`Skipping missing file: ${file}`);
  }
}

// add all your modules here safely
runIfExists("feeder.js", "Feeder");
runIfExists("generator/build-pages.js", "Page Builder");
runIfExists("generator/build-amazon-pages.js", "Amazon Pages");
