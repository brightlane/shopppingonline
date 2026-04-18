/**
 * multi-agent-execution-system.js
 * AAC Multi-Agent Optimization Layer
 * Runs competing strategies and selects best-performing outcomes
 */

const fs = require("fs");
const path = require("path");

// === CONFIG ===
const RESULT_LOG = path.join(__dirname, "cache/agent-results.json");

// === ENTRY POINT ===
function runMultiAgentSystem(context) {
  console.log("🤖 Running Multi-Agent Execution System...");

  const agents = [
    createSEOAgent(),
    createRevenueAgent(),
    createTrafficAgent()
  ];

  const results = agents.map(agent => runAgent(agent, context));

  const best = selectBestAgent(results);

  saveResults(results, best);

  console.log("🏆 Best Agent:", best.name);

  return best;
}

// === AGENT DEFINITIONS ===
function createSEOAgent() {
  return {
    name: "SEO_AGENT",
    run: (ctx) => {
      const score =
        (ctx.keywordStrength || 0.5) * 0.6 +
        (ctx.contentDepth || 0.5) * 0.4;

      return {
        name: "SEO_AGENT",
        score,
        decision: score > 0.6 ? "BOOST_CONTENT" : "OPTIMIZE_KEYWORDS"
      };
    }
  };
}

function createRevenueAgent() {
  return {
    name: "REVENUE_AGENT",
    run: (ctx) => {
      const score =
        (ctx.affiliateStrength || 0.5) * 0.7 +
        (ctx.conversionPotential || 0.5) * 0.3;

      return {
        name: "REVENUE_AGENT",
        score,
        decision: score > 0.6 ? "PRIORITIZE_PRODUCTS" : "TEST_OFFERS"
      };
    }
  };
}

function createTrafficAgent() {
  return {
    name: "TRAFFIC_AGENT",
    run: (ctx) => {
      const score =
        (ctx.socialPotential || 0.5) * 0.5 +
        (ctx.searchVolume || 0.5) * 0.5;

      return {
        name: "TRAFFIC_AGENT",
        score,
        decision: score > 0.6 ? "DISTRIBUTE_CONTENT" : "EXPAND_REACH"
      };
    }
  };
}

// === RUN SINGLE AGENT ===
function runAgent(agent, context) {
  return agent.run(context);
}

// === SELECT BEST AGENT ===
function selectBestAgent(results) {
  return results.reduce((best, current) => {
    return current.score > best.score ? current : best;
  }, results[0]);
}

// === SAVE RESULTS ===
function saveResults(results, best) {
  const output = {
    timestamp: Date.now(),
    results,
    best
  };

  fs.mkdirSync(path.dirname(RESULT_LOG), { recursive: true });

  fs.writeFileSync(RESULT_LOG, JSON.stringify(output, null, 2));
}

// === EXPORTS ===
module.exports = {
  runMultiAgentSystem
};

// === TEST RUN ===
if (require.main === module) {
  const result = runMultiAgentSystem({
    keywordStrength: 0.7,
    contentDepth: 0.6,
    affiliateStrength: 0.8,
    conversionPotential: 0.5,
    socialPotential: 0.4,
    searchVolume: 0.8
  });

  console.log("Final Decision:", result);
}
