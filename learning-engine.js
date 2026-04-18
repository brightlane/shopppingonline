const fs = require("fs");

const LEARNING_ENGINE = {
  file: "./cache/metrics.json",

  log: function (msg) {
    console.log("[LEARNING ENGINE]", msg);
  },

  // 📦 load stored metrics
  load: function () {
    try {
      if (!fs.existsSync(this.file)) return [];
      return JSON.parse(fs.readFileSync(this.file));
    } catch (e) {
      this.log("⚠ Error loading metrics");
      return [];
    }
  },

  // 💾 save metrics
  save: function (data) {
    fs.mkdirSync("./cache", { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify(data, null, 2));
  },

  // 📊 record event (click / sale / SEO signal)
  record: function (event) {
    const data = this.load();

    data.push({
      ...event,
      timestamp: Date.now()
    });

    // prevent unlimited growth
    if (data.length > 5000) data.shift();

    this.save(data);

    this.log(`Recorded event: ${event.type}`);
  },

  // 📈 calculate performance summary
  analyze: function () {
    const data = this.load();

    const stats = {
      clicks: 0,
      sales: 0,
      ctr: 0,
      revenue: 0
    };

    data.forEach(e => {
      if (e.type === "click") stats.clicks++;
      if (e.type === "sale") stats.sales++;
      if (e.revenue) stats.revenue += e.revenue;
    });

    stats.ctr = stats.clicks > 0 ? (stats.sales / stats.clicks) : 0;

    return stats;
  },

  // 🧠 decide what system should prioritize next
  getStrategy: function () {
    const stats = this.analyze();

    this.log("Analyzing system performance...");

    if (stats.ctr < 0.01) {
      return {
        mode: "SEO_BOOST",
        reason: "Low conversion rate detected"
      };
    }

    if (stats.revenue > 1000) {
      return {
        mode: "SCALE_PRODUCTS",
        reason: "High revenue detected"
      };
    }

    return {
      mode: "BALANCED",
      reason: "Stable performance"
    };
  },

  // 🔁 feedback loop into orchestrator
  getOptimizationSignal: function () {
    const strategy = this.getStrategy();

    this.log(`Strategy selected: ${strategy.mode}`);

    return strategy;
  }
};

module.exports = LEARNING_ENGINE;
