window.AFFILIATE_TAG = "brightlane201-20";

window.amazonLink = function (asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${window.AFFILIATE_TAG}`;
};

/* SEO GLOBAL INJECTION */
window.SEO_META = `
<meta name="google-site-verification" content="eWVDN3vbam9nnaZQu7wAQKyfmJJdM7zjI80l4DGeUrQ" />
<meta name="msvalidate.01" content="574044E39556B8B8DAAF1D1F233C87B0" />
`;
