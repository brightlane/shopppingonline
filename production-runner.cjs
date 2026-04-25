#!/usr/bin/env node

/**
 * production-runner.cjs
 * Enterprise orchestration layer for full SEO + affiliate + build system
 * Safe under ESM projects (uses child_process only)
 */

const { spawnSync } = require("child_process");
const fs = require("fs");

const ROOT = process.cwd();

/**
 * =========================
 * GLOBAL CONFIG
 * =========================
 */

const CONFIG = {
  retryCount: 1,
  stopOnCriticalFailure: true,
  logFile: "./logs/production-run.log",
  enableWatchMode: false,
  watchIntervalMs: 1000 * 60 * 30
};

/**
 * =========================
 * PIPELINE STATE TRACKING
 * =========================
 */

let state = {
  startTime: Date.now(),
  completedStages: [],
  failedTasks: [],
  totalTasks: 0,
  successTasks: 0
};

/**
 * =========================
 * PIPELINE DEFINITION
 * =========================
 */

const PIPELINE = [
  {
    name: "SYSTEM BOOTSTRAP",
    critical: true,
    tasks: [
      "node deploy-guard.js",
      "node content-integrity-gate.js",
      "node system-governor-engine.js"
    ]
  },

  {
    name: "DATA INGESTION LAYER",
    critical: true,
    tasks: [
      "node feeder-registry-system.js",
      "node auto-product-feed.js",
      "node real-data-ingestion-engine.js",
      "node paapi-fetcher.js"
    ]
  },

  {
    name: "DATA CLEANING + SAFETY",
    critical: true,
    tasks: [
      "node product-validator.js",
      "node product-sanitizer-final.js",
      "node product-safety.js",
      "node fix-products-data.js"
    ]
  },

  {
    name: "KEYWORD INTELLIGENCE SYSTEM",
    critical: true,
    tasks: [
      "node keyword-stream-engine.js",
      "node keyword-intent-engine.js",
      "node keyword-evolution-engine.js",
      "node ai-keyword-expander.js"
    ]
  },

  {
    name: "SEO GENERATION ENGINE",
    critical: true,
    tasks: [
      "node seo-global-engine.js",
      "node seo-page-builder.js",
      "node generate-seo-pages.js",
      "node generate-pages.js"
    ]
  },

  {
    name: "AFFILIATE ROUTING NETWORK",
    critical: false,
    tasks: [
      "node affiliate-router-global.js",
      "node global-affiliate-router.js",
      "node affiliate-routing-engine.js",
      "node auto-affiliate.js"
    ]
  },

  {
    name: "PAGE BUILD + STRUCTURE",
    critical: true,
    tasks: [
      "node build.js",
      "node master-build.js",
      "node generate-keyword-pages.js",
      "node rebuild-products.js"
    ]
  },

  {
    name: "INTERNAL LINKING SYSTEM",
    critical: false,
    tasks: [
      "node internal-linker.js",
      "node seo-link-injector.js",
      "node silo-links.js",
      "node nav-builder.js"
    ]
  },

  {
    name: "SITEMAP + ROUTING",
    critical: false,
    tasks: [
      "node sitemap-segmented.js",
      "node redirect-handler.js"
    ]
  },

  {
    name: "DEPLOYMENT PREPARATION",
    critical: false,
    tasks: [
      "git add .",
      "git commit -m \"auto: production-runner deploy\" || true"
    ]
  }
];

/**
 * =========================
 * LOGGING SYSTEM
 * =========================
 */

function log(message, type = "info") {
  const colors = {
    info: "\x1b[36m",
    success: "\x1b[32m",
    warn: "\x1b[33m",
    error: "\x1b[31m",
    reset: "\x1b[0m"
  };

  const line = `[${new Date().toISOString()}] ${message}`;

  console.log(colors[type] + "[RUNNER] " + line + colors.reset);

  fs.appendFileSync(CONFIG.logFile, line + "\n");
}

/**
 * =========================
 * COMMAND EXECUTION CORE
 * =========================
 */

function runCommand(cmd) {
  log(`EXEC → ${cmd}`, "info");

  const result = spawnSync(cmd, {
    shell: true,
    stdio: "inherit",
    env: process.env
  });

  return result.status === 0;
}

/**
 * =========================
 * TASK EXECUTOR
 * =========================
 */

function executeTask(task, critical) {
  state.totalTasks++;

  let success = runCommand(task);

  if (!success && CONFIG.retryCount > 0) {
    log(`RETRY → ${task}`, "warn");
    success = runCommand(task);
  }

  if (success) {
    state.successTasks++;
    return true;
  }

  state.failedTasks.push(task);

  log(`FAILED → ${task}`, "error");

  if (critical && CONFIG.stopOnCriticalFailure) {
    log(`CRITICAL FAILURE → STOPPING SYSTEM`, "error");
    process.exit(1);
  }

  return false;
}

/**
 * =========================
 * STAGE EXECUTOR
 * =========================
 */

function runStage(stage) {
  log(`==============================`, "info");
  log(`STAGE: ${stage.name}`, "info");
  log(`CRITICAL: ${stage.critical}`, "info");
  log(`==============================`, "info");

  for (const task of stage.tasks) {
    executeTask(task, stage.critical);
  }

  state.completedStages.push(stage.name);

  log(`STAGE COMPLETE → ${stage.name}`, "success");
}

/**
 * =========================
 * PIPELINE RUNNER
 * =========================
 */

function runPipeline() {
  log("🚀 PRODUCTION PIPELINE STARTED", "success");

  for (const stage of PIPELINE) {
    runStage(stage);
  }

  const duration = (Date.now() - state.startTime) / 1000;

  log("🎯 PIPELINE COMPLETE", "success");
  log(`⏱ Duration: ${duration}s`, "info");
  log(`📊 Success: ${state.successTasks}/${state.totalTasks}`, "info");

  if (state.failedTasks.length) {
    log(`⚠ Failed tasks: ${state.failedTasks.length}`, "warn");
  }
}

/**
 * =========================
 * WATCH MODE
 * =========================
 */

function watchMode() {
  log("👁 WATCH MODE ACTIVE", "info");

  runPipeline();

  setInterval(() => {
    log("♻ RE-RUNNING PIPELINE", "info");

    state = {
      startTime: Date.now(),
      completedStages: [],
      failedTasks: [],
      totalTasks: 0,
      successTasks: 0
    };

    runPipeline();
  }, CONFIG.watchIntervalMs);
}

/**
 * =========================
 * ENTRY
 * =========================
 */

const args = process.argv.slice(2);

if (args.includes("--watch")) {
  watchMode();
} else {
  runPipeline();
}
