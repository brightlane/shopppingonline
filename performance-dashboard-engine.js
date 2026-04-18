const fs = require("fs");

const PERFORMANCE_ENGINE = {
  file: "./cache/performance.json",

  log: function (msg) {
    console.log("[PERFORMANCE ENGINE]", msg);
  },

  // 📦 load data
  load: function () {
    try {
      if (!fs.existsSync(this.file)) return [];
      return JSON.parse(fs.readFileSync(this.file));
    } catch (e) {
      this.log("⚠ Error loading performance data");
      return [];
    }
  },

  // 💾 save data
  save: function (data) {
    fs.mkdirSync("./cache", { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify(data, null, 2));
  },

  // 📊 record event (click, sale, impression, SEO signal)
  recordEvent: function (event) {
    const data = this.load();

    data.push({
      ...event,
      timestamp: Date.now()
    });

    // prevent runaway file growth
    if (data.length > 10000) data.shift();

    this.save(data);

    this.log(`Recorded event: ${event.type}`);
  },

  // 📈 calculate feeder performance score
  calculateFeederScores: function () {
    const data = this.load();

    const scores = {};

    data.forEach(event => {
      const feeder = event.feeder || "unknown";

      if (!scores[feeder]) {
        scores[feeder] = {
          clicks: 0,
          sales: 0,
          revenue: 0,
          score: 0
        };
      }

      if (event.type === "click") scores[feeder].clicks++;
      if (event.type === "sale") scores[feeder].sales++;
      if (event.revenue) scores[feeder].revenue += event.revenue;
    });

    // compute score
    Object.keys(scores).forEach(f => {
      const s = scores[f];

      const ctr = s.clicks > 0 ? s.sales / s.clicks : 0;
      const revenueWeight = s.revenue * 0.7;
      const ctrWeight = ctr * 100;

      s.score = revenueWeight + ctrWeight;
    });

    return scores;
  },

  // 🌍 system-wide health
  systemHealth: function () {
    const scores = this.calculateFeederScores();

    let totalScore = 0;
    let count = 0;

    Object.values(scores).forEach(s => {
      totalScore += s.score;
      count++;
    });

    const avg = count ? totalScore / count : 0;

    return {
      systemScore: avg,
      status:
        avg > 70 ? "HEALTHY" :
        avg > 40 ? "STABLE" :
        "CRITICAL"
    };
  },

  // 🧠 optimization recommendations
  recommend: function () {
    const scores = this.calculateFeederScores();

    const sorted = Object.entries(scores)
      .sort((a, b) => b[1].score - a[1].score);

    const best = sorted[0];
    const worst = sorted[sorted.length - 1];

    return {
      boost: best ? best[0] : null,
      reduce: worst ? worst[0] : null
    };
  },

  // 🔁 full analysis run
  runAnalysis: function () {
    this.log("Running system performance analysis...");

    const health = this.systemHealth();
    const rec = this.recommend();

    this.log(`System status: ${health.status}`);
    this.log(`Boost feeder: ${rec.boost}`);
    this.log(`Reduce feeder: ${rec.reduce}`);

    return {
      health,
      recommendations: rec
    };
  }
};

module.exports = PERFORMANCE_ENGINE;
