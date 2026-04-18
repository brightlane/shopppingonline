const fs = require('fs');
const { spawn } = require('child_process');
const FEEDER_REGISTRY = require('./feeder-registry');
const LEARNING_ENGINE = require('./learning-engine');

// Execution modes: can either be 'sequential' or 'parallel'
const EXECUTION_MODE = 'parallel'; // or 'sequential'

const EXECUTION_ENGINE = {
  // 🛠 Execute a single feeder
  executeFeeder: function(feeder, config) {
    try {
      console.log(`[EXECUTION ENGINE] Executing feeder: ${feeder.key} with config: ${JSON.stringify(config)}`);

      // Placeholder for actual execution logic
      // Example: Spawning a child process to execute each feeder
      const process = spawn('node', [`./feeders/${feeder.key}-feeder.js`, JSON.stringify(config)]);
      
      process.stdout.on('data', (data) => {
        console.log(`[EXECUTION ENGINE] Output from ${feeder.key}: ${data.toString()}`);
      });

      process.stderr.on('data', (data) => {
        console.error(`[EXECUTION ENGINE] Error in ${feeder.key}: ${data.toString()}`);
      });

      process.on('exit', (code) => {
        if (code === 0) {
          console.log(`[EXECUTION ENGINE] Feeder ${feeder.key} executed successfully.`);
        } else {
          console.error(`[EXECUTION ENGINE] Feeder ${feeder.key} failed with exit code ${code}`);
        }
      });
    } catch (error) {
      console.error(`[EXECUTION ENGINE] Error executing feeder ${feeder.key}: ${error.message}`);
    }
  },

  // 📊 Execute all feeders based on execution mode (parallel or sequential)
  executeAllFeeders: function() {
    const feeders = FEEDER_REGISTRY.load();
    const prioritizedFeeders = FEEDER_REGISTRY.prioritizeFeeders();

    if (EXECUTION_MODE === 'sequential') {
      console.log("[EXECUTION ENGINE] Executing feeders sequentially...");
      prioritizedFeeders.forEach((feeder, index) => {
        setTimeout(() => {
          this.executeFeeder(feeder, feeder.config);
        }, index * 1000); // Add a slight delay between feeders
      });
    } else {
      console.log("[EXECUTION ENGINE] Executing feeders in parallel...");
      prioritizedFeeders.forEach((feeder) => {
        this.executeFeeder(feeder, feeder.config);
      });
    }
  },

  // 🔄 Monitor the execution status of all feeders
  monitorExecution: function() {
    const feeders = FEEDER_REGISTRY.load();
    console.log("[EXECUTION ENGINE] Monitoring execution status...");
    
    // Mock execution status for each feeder
    feeders.forEach((feeder) => {
      console.log(`[EXECUTION ENGINE] Feeder: ${feeder.key} status: ${feeder.status || 'Running'}`);
    });
  },

  // 💾 Save execution log to file
  saveExecutionLog: function(logs) {
    const logFile = './logs/execution-log.json';

    try {
      fs.mkdirSync('./logs', { recursive: true });
      fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
      console.log("[EXECUTION ENGINE] Execution log saved.");
    } catch (error) {
      console.error("[EXECUTION ENGINE] Error saving execution log:", error);
    }
  },

  // 📅 Schedule feeder execution (optional: can run on intervals)
  scheduleExecution: function(interval = 3600) {
    console.log(`[EXECUTION ENGINE] Scheduling feeder execution every ${interval} seconds.`);
    setInterval(() => {
      this.executeAllFeeders();
    }, interval * 1000);
  },

  // 🔄 Main execution entry point
  run: function() {
    console.log("[EXECUTION ENGINE] Starting feeder execution...");

    // Optionally, run execution on a schedule
    this.scheduleExecution(3600); // Run every 1 hour by default

    // Execute all feeders once
    this.executeAllFeeders();
  }
};

module.exports = EXECUTION_ENGINE;
