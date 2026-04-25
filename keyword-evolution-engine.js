/**
 * keyword-evolution-engine.js
 * Evolves keyword sets over time based on performance signals
 * Works safely with or without analytics data
 */

const fs = require("fs");

class KeywordEvolutionEngine {
  constructor(options = {}) {
    this.keywordsFile = options.keywordsFile || "./keywords.json";
    this.historyFile = options.historyFile || "./cache/keyword-history.json";

    this.evolutionRate = options.evolutionRate || 0.25; // how aggressively we mutate
    this.maxKeywords = options.maxKeywords || 5000;

    this.simulationMode = options.simulationMode ?? true; // safe default
  }

  loadKeywords() {
    const raw = fs.readFileSync(this.keywordsFile, "utf-8");
    return JSON.parse(raw).keywords || [];
  }

  saveKeywords(keywords) {
    const data = { keywords };
    fs.writeFileSync(this.keywordsFile, JSON.stringify(data, null, 2));
  }

  loadHistory() {
    if (!fs.existsSync(this.historyFile)) return {};
    return JSON.parse(fs.readFileSync(this.historyFile, "utf-8"));
  }

  saveHistory(history) {
    fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2));
  }

  scoreKeyword(keyword, history) {
    if (this.simulationMode) {
      // simulate performance if no analytics exist
      return Math.random();
    }

    const record = history[keyword];
    if (!record) return 0.5;

    // simple scoring model (can upgrade later to CTR/revenue weighting)
    return (
      (record.clicks || 0) * 0.4 +
      (record.conversions || 0) * 0.5 +
      (record.impressions || 0) * 0.1
    );
  }

  mutateKeyword(keyword) {
    const variants = [
      `${keyword} best`,
      `${keyword} review`,
      `${keyword} 2026`,
      `buy ${keyword}`,
      `${keyword} amazon`,
      `${keyword} deal`,
      `cheap ${keyword}`,
      `${keyword} comparison`
    ];

    return variants[Math.floor(Math.random() * variants.length)];
  }

  evolve() {
    const keywords = this.loadKeywords();
    const history = this.loadHistory();

    const scored = keywords.map(k => ({
      keyword: k,
      score: this.scoreKeyword(k, history)
    }));

    // sort best performing first
    scored.sort((a, b) => b.score - a.score);

    const top = scored.slice(0, Math.floor(keywords.length * 0.6));
    const bottom = scored.slice(Math.floor(keywords.length * 0.6));

    const evolved = [];

    // keep top performers
    for (const item of top) {
      evolved.push(item.keyword);
    }

    // mutate underperformers
    for (const item of bottom) {
      const mutated = this.mutateKeyword(item.keyword);
      evolved.push(mutated);
    }

    // cap size
    const finalSet = evolved.slice(0, this.maxKeywords);

    this.saveKeywords(finalSet);
    this.saveHistory(history);

    return {
      before: keywords.length,
      after: finalSet.length,
      topKept: top.length,
      mutated: bottom.length
    };
  }
}

module.exports = KeywordEvolutionEngine;
