/**
 * global-control-dashboard.js
 * The real-time monitoring and control center for the entire AAC system
 */

const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

// === CONFIG ===
const PORT = 3000;
const STATUS_FILE = path.join(__dirname, "status.log");
const STATS_FILE = path.join(__dirname, "system-stats.json");
const ERROR_LOG = path.join(__dirname, "error.log");

// Serve the dashboard UI (static files)
app.use(express.static(path.join(__dirname, "public")));

// === ROUTES ===

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// System Status
app.get("/status", (req, res) => {
  const status = loadStatusFile();
  res.json(status);
});

// Trigger Full System Rebuild
app.get("/rebuild", (req, res) => {
  exec("node core.orchestrator.js", (err, stdout, stderr) => {
    if (err) {
      fs.appendFileSync(ERROR_LOG, `${new Date().toISOString()} - ERROR: ${stderr}\n`);
      return res.status(500).send("Rebuild failed.");
    }
    fs.appendFileSync(STATUS_FILE, `${new Date().toISOString()} - SYSTEM REBUILD TRIGGERED\n`);
    res.send("System rebuild triggered successfully!");
  });
});

// System Stats (Performance Data)
app.get("/stats", (req, res) => {
  const stats = loadStatsFile();
  res.json(stats);
});

// View Logs
app.get("/logs", (req, res) => {
  const logs = fs.readFileSync(ERROR_LOG, "utf8");
  res.send(`<pre>${logs}</pre>`);
});

// === FUNCTIONS ===

// Load system status
function loadStatusFile() {
  if (fs.existsSync(STATUS_FILE)) {
    const status = fs.readFileSync(STATUS_FILE, "utf8");
    return { status };
  }
  return { status: "System offline" };
}

// Load system stats
function loadStatsFile() {
  if (fs.existsSync(STATS_FILE)) {
    const stats = fs.readFileSync(STATS_FILE, "utf8");
    return JSON.parse(stats);
  }
  return { error: "No stats available" };
}

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`🚀 Global Control Dashboard running at http://localhost:${PORT}`);
});

module.exports = app;
