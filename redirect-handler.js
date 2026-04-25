const url = require("url");
const { logClick } = require("./affiliate-router-global");

// -----------------------------
// PARSE QUERY SAFE
// -----------------------------
function parseQuery(reqUrl) {
  return url.parse(reqUrl, true).query;
}

// -----------------------------
// BASIC SECURITY CHECK
// -----------------------------
function isValidRedirect(targetUrl) {
  if (!targetUrl) return false;

  const allowedDomains = [
    "amazon.com",
    "amazon.de",
    "amazon.co.uk",
    "amazon.fr",
    "amazon.it",
    "amazon.es",
    "amazon.ca",
    "amazon.co.jp"
  ];

  try {
    const parsed = new URL(targetUrl);
    return allowedDomains.includes(parsed.hostname);
  } catch (e) {
    return false;
  }
}

// -----------------------------
// MAIN REDIRECT HANDLER
// -----------------------------
function handleRedirect(req, res) {
  const query = parseQuery(req.url);

  const target = decodeURIComponent(query.url || "");
  const meta = query.data ? JSON.parse(decodeURIComponent(query.data)) : {};

  // ❌ Block invalid redirects
  if (!isValidRedirect(target)) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("Invalid redirect target");
  }

  // 📊 Log click event
  logClick({
    url: target,
    ...meta,
    ip: req.socket.remoteAddress,
    userAgent: req.headers["user-agent"]
  });

  // 🚀 Redirect user to Amazon
  res.writeHead(302, {
    Location: target
  });

  res.end();
}

// -----------------------------
// OPTIONAL: EXPRESS VERSION SUPPORT
// -----------------------------
function redirectMiddleware(req, res, next) {
  if (!req.url.startsWith("/redirect")) {
    return next();
  }

  return handleRedirect(req, res);
}

module.exports = {
  handleRedirect,
  redirectMiddleware
};
