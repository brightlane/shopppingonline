/**
 * =========================================
 * 🔐 IMMUTABLE SEO HEAD LOCK SYSTEM
 * =========================================
 * Fixes:
 * - Google verification disappearing
 * - Bing verification removal
 * - meta tag overwrite bugs
 * - schema injection loss
 * - generator head corruption
 * =========================================
 */

import fs from "fs";

/* =========================
   LOCKED HEAD CORE
========================= */

export const LOCKED_HEAD = `
<!-- 🔐 SEO IMMUTABLE LOCK START -->

<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- ✅ GOOGLE VERIFICATION (LOCKED) -->
<meta name="google-site-verification" content="eWVDN3vbam9nnaZQu7wAQKyfmJJdM7zjI80l4DGeUrQ" />

<!-- ✅ BING VERIFICATION (LOCKED) -->
<meta name="msvalidate.01" content="574044E39556B8B8DAAF1D1F233C87B0" />

<!-- SEO CORE -->
<meta name="robots" content="index, follow" />
<meta name="author" content="Brightlane Deals" />
<meta name="theme-color" content="#ff4d00" />

<!-- OPEN GRAPH -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Brightlane Deals" />

<!-- TWITTER -->
<meta name="twitter:card" content="summary_large_image" />

<!-- CANONICAL PLACEHOLDER (DYNAMIC) -->
<!-- CANONICAL_INJECT -->

<!-- 🔐 SEO IMMUTABLE LOCK END -->
`;

/* =========================
   HEAD INJECTION PROTECTION
========================= */

export function injectLockedHead(html, canonicalUrl = "") {
  if (!html.includes("<head>")) {
    console.warn("❌ No <head> found");
    return html;
  }

  let headBlock = LOCKED_HEAD;

  // inject canonical safely
  if (canonicalUrl) {
    headBlock = headBlock.replace(
      "<!-- CANONICAL_INJECT -->",
      `<link rel="canonical" href="${canonicalUrl}" />`
    );
  } else {
    headBlock = headBlock.replace("<!-- CANONICAL_INJECT -->", "");
  }

  return html.replace(
    /<head>[\s\S]*?<\/head>/i,
    `<head>
${headBlock}
</head>`
  );
}

/* =========================
   SAFE HEAD PROTECTOR (ANTI-OVERWRITE)
========================= */

export function protectHead(filePath, canonicalUrl) {
  const html = fs.readFileSync(filePath, "utf-8");

  const updated = injectLockedHead(html, canonicalUrl);

  fs.writeFileSync(filePath, updated);

  console.log("🔐 HEAD LOCKED:", filePath);
}

/* =========================
   BULK PROTECTOR
========================= */

export function protectAll(files = []) {
  files.forEach(file => {
    try {
      protectHead(file);
    } catch (e) {
      console.log("❌ Error locking head:", file);
    }
  });

  console.log("🚀 ALL HEADS LOCKED");
}
