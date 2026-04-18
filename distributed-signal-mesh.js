/**
 * distributed-signal-mesh.js
 * AAC Global Event + State Mesh
 * Shared communication layer for all autonomous engines
 */

const fs = require("fs");
const path = require("path");

// === CONFIG ===
const STATE_FILE = path.join(__dirname, "cache/global-state.json");
const EVENT_LOG = path.join(__dirname, "cache/event-log.json");

// === GLOBAL STATE ===
function loadState() {
  try {
    if (!fs.existsSync(STATE_FILE)) {
      return {
        timestamp: Date.now(),
        metrics: {
          seo: 0,
          revenue: 0,
          traffic: 0,
          health: 1
        },
        flags: {}
      };
    }

    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch (e) {
    return { metrics: {}, flags: {} };
  }
}

// === SAVE STATE ===
function saveState(state) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// === EVENT BUS ===
function emitEvent(type, payload = {}) {
  const event = {
    type,
    payload,
    timestamp: Date.now()
  };

  fs.mkdirSync(path.dirname(EVENT_LOG), { recursive: true });

  let log = [];
  if (fs.existsSync(EVENT_LOG)) {
    try {
      log = JSON.parse(fs.readFileSync(EVENT_LOG, "utf8"));
    } catch (e) {
      log = [];
    }
  }

  log.push(event);

  // prevent unlimited growth
  if (log.length > 500) log = log.slice(-500);

  fs.writeFileSync(EVENT_LOG, JSON.stringify(log, null, 2));

  return event;
}

// === UPDATE GLOBAL METRICS ===
function updateMetrics(updates = {}) {
  const state = loadState();

  state.metrics = {
    ...state.metrics,
    ...updates
  };

  state.timestamp = Date.now();

  saveState(state);

  emitEvent("metrics_updated", updates);

  return state;
}

// === FLAG SYSTEM (CONTROL SIGNALS) ===
function setFlag(name, value) {
  const state = loadState();

  state.flags[name] = value;

  saveState(state);

  emitEvent("flag_set", { name, value });

  return state;
}

// === READ SIGNAL CONTEXT ===
function getSystemContext() {
  const state = loadState();

  const events = fs.existsSync(EVENT_LOG)
    ? JSON.parse(fs.readFileSync(EVENT_LOG, "utf8"))
    : [];

  return {
    state,
    recentEvents: events.slice(-20)
  };
}

// === AUTO-HEAL SIGNAL ===
function triggerSystemHeal(reason) {
  return emitEvent("system_heal", {
    reason,
    action: "rewrite + rebuild + rebalance"
  });
}

// === EXPORTS ===
module.exports = {
  loadState,
  saveState,
  emitEvent,
  updateMetrics,
  setFlag,
  getSystemContext,
  triggerSystemHeal
};

// === OPTIONAL TEST RUN ===
if (require.main === module) {
  console.log("🧬 Initializing Distributed Signal Mesh...");

  updateMetrics({ seo: 1, revenue: 0.5, traffic: 0.8 });

  setFlag("system_ready", true);

  emitEvent("boot_complete");

  console.log("✅ Mesh online");
}
