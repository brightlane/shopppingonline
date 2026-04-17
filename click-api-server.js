const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const FILE = path.join(__dirname, "data/clicks.json");

/**
 * 📦 LOAD DATA
 */
function load() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

/**
 * 💾 SAVE DATA
 */
function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/**
 * 🔥 CLICK ENDPOINT
 * Called from GitHub Pages frontend
 */
app.post("/click", (req, res) => {
  const { asin } = req.body;

  if (!asin) {
    return res.status(400).json({ error: "Missing ASIN" });
  }

  const data = load();

  data[asin] = (data[asin] || 0) + 1;

  save(data);

  console.log("📊 Click recorded:", asin, data[asin]);

  res.json({
    success: true,
    asin,
    clicks: data[asin]
  });
});

/**
 * 🧠 GET STATS (OPTIONAL DEBUG)
 */
app.get("/stats", (req, res) => {
  res.json(load());
});

/**
 * 🚀 START SERVER
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Click API running on port", PORT);
});
