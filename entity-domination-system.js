/**
 * entity-domination-system.js
 * BrightLane Semantic SEO Graph Engine
 */

const fs = require("fs");
const path = require("path");

// ============================
// CONFIG
// ============================
const CONFIG = {
  pagesDir: path.join(__dirname, "pages"),
  outputFile: path.join(__dirname, "seo-graph.json")
};

// ============================
// ENTITY EXTRACTION (simple NLP layer)
// ============================
function extractEntities(text) {
  const keywords = [];

  const patterns = [
    /coffee/i,
    /vacuum/i,
    /ring light/i,
    /stanley/i,
    /acne/i,
    /solar/i,
    /power bank/i,
    /laptop/i,
    /air fryer/i
  ];

  patterns.forEach(p => {
    if (p.test(text)) keywords.push(p.source.replace(/\/i/g, ""));
  });

  return [...new Set(keywords)];
}

// ============================
// PAGE SCANNER
// ============================
function scanPages() {
  const files = fs.readdirSync(CONFIG.pagesDir);

  return files
    .filter(f => f.endsWith(".html"))
    .map(file => {
      const content = fs.readFileSync(
        path.join(CONFIG.pagesDir, file),
        "utf-8"
      );

      const titleMatch = content.match(/<title>(.*?)<\/title>/i);

      const title = titleMatch ? titleMatch[1] : file;

      return {
        file,
        title,
        entities: extractEntities(title + " " + content)
      };
    });
}

// ============================
// BUILD SEO GRAPH
// ============================
function buildGraph(pages) {
  const graph = {
    nodes: [],
    edges: []
  };

  pages.forEach(page => {
    graph.nodes.push({
      id: page.file,
      title: page.title,
      entities: page.entities
    });

    // link related pages together
    pages.forEach(other => {
      if (page.file === other.file) return;

      const shared = page.entities.filter(e =>
        other.entities.includes(e)
      );

      if (shared.length > 0) {
        graph.edges.push({
          from: page.file,
          to: other.file,
          strength: shared.length
        });
      }
    });
  });

  return graph;
}

// ============================
// INTERNAL LINK MAP GENERATOR
// ============================
function generateInternalLinks(graph) {
  const linkMap = {};

  graph.edges.forEach(edge => {
    if (!linkMap[edge.from]) linkMap[edge.from] = [];

    linkMap[edge.from].push({
      to: edge.to,
      strength: edge.strength
    });
  });

  return linkMap;
}

// ============================
// MAIN ENGINE
// ============================
function runEntitySystem() {
  console.log("🧠 Running Entity Domination System...");

  const pages = scanPages();

  const graph = buildGraph(pages);
  const links = generateInternalLinks(graph);

  const output = {
    generatedAt: new Date().toISOString(),
    graph,
    internalLinks: links
  };

  fs.writeFileSync(
    CONFIG.outputFile,
    JSON.stringify(output, null, 2)
  );

  console.log("✅ Entity SEO graph generated");
}

// ============================
// AUTO RUN
// ============================
if (require.main === module) {
  runEntitySystem();
}

// ============================
// EXPORTS
// ============================
module.exports = {
  runEntitySystem,
  scanPages,
  buildGraph,
  generateInternalLinks
};
