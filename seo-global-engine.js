// seo-global-engine.js

const config = require("./config");

const AMAZON_DOMAINS = {
  us: "amazon.com",
  de: "amazon.de",
  uk: "amazon.co.uk",
  ca: "amazon.ca",
  fr: "amazon.fr",
  it: "amazon.it",
  es: "amazon.es",
  jp: "amazon.co.jp"
};

const AFFILIATE_TAGS = {
  us: "yourtag-20",
  de: "yourtag-21",
  uk: "yourtag-22",
  ca: "yourtag-23",
  fr: "yourtag-24",
  it: "yourtag-25",
  es: "yourtag-26",
  jp: "yourtag-27"
};

const LANGS = ["en", "de", "es", "fr", "it"];

// -----------------------------
// 1. KEYWORD EXPANSION (4× INTENT)
// -----------------------------
function expandKeyword(keyword) {
  const base = keyword.trim();

  const variations = [
    base,
    `Best ${base}`,
    `${base} Review`,
    `${base} 2026`,
    `${base} Amazon`,
    `Cheap ${base}`,
    `${base} Deals`
  ];

  return [...new Set(variations)];
}

// -----------------------------
// 2. SLUG GENERATION
// -----------------------------
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// -----------------------------
// 3. AFFILIATE LINK BUILDER
// -----------------------------
function buildAffiliateLink({ asin, country }) {
  const domain = AMAZON_DOMAINS[country] || AMAZON_DOMAINS.us;
  const tag = AFFILIATE_TAGS[country] || AFFILIATE_TAGS.us;

  return `https://${domain}/dp/${asin}?tag=${tag}`;
}

// -----------------------------
// 4. META TAG GENERATOR
// -----------------------------
function buildMeta({ keyword, country, lang }) {
  return {
    title: `${keyword} 2026 Review | Best Deals`,
    description: `Find the best ${keyword} deals in ${country.toUpperCase()} with updated 2026 reviews.`,
    keywords: `${keyword}, best ${keyword}, ${keyword} review, ${country} deals`,
    ogTitle: `${keyword} - Top Picks 2026`,
    ogDescription: `Compare the best ${keyword} options in your region.`,
    lang
  };
}

// -----------------------------
// 5. HREFLANG BUILDER
// -----------------------------
function buildHreflang(baseUrl, slug) {
  return LANGS.map((lang) => {
    return {
      lang,
      url: `${baseUrl}/${slug}/${lang}/`
    };
  });
}

// -----------------------------
// 6. CROSS LINK ENGINE
// -----------------------------
function buildCrossLinks(keywordSlug) {
  return [
    `/best-${keywordSlug}/en/`,
    `/review-${keywordSlug}/en/`,
    `/vs-${keywordSlug}/en/`,
    `/top-${keywordSlug}/en/`
  ];
}

// -----------------------------
// 7. MAIN PAGE GENERATOR
// -----------------------------
function generateSEOPage({ keyword, asin, country = "us" }) {
  const expanded = expandKeyword(keyword);
  const slug = slugify(keyword);

  return {
    keyword,
    slug,
    expandedKeywords: expanded,

    affiliateLink: buildAffiliateLink({ asin, country }),

    meta: buildMeta({
      keyword,
      country,
      lang: "en"
    }),

    hreflang: buildHreflang("https://yourdomain.com", slug),

    crossLinks: buildCrossLinks(slug)
  };
}

module.exports = {
  expandKeyword,
  slugify,
  buildAffiliateLink,
  buildMeta,
  buildHreflang,
  buildCrossLinks,
  generateSEOPage
};
