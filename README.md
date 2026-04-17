# 🔥 Amazon Affiliate Deals Site (Locked System)

This is a structured Amazon affiliate website built for scalable product pages, SEO growth, and consistent monetization using a locked affiliate link system.

---

# 🧱 SYSTEM OVERVIEW

This project uses a **centralized affiliate lock system** to ensure all Amazon links are consistent and never lose tracking.

### ✔ Key Features
- Central affiliate tag system
- Reusable product template
- Scalable category structure
- SEO-ready pages (sitemap + robots included)
- Click tracking support (tracker.js)
- Mobile-friendly responsive design

---

# 🔒 AFFILIATE LOCK SYSTEM

All Amazon links are generated using a single global function:

### 📁 `config.js`
```js
window.AFFILIATE_TAG = "brightlane201-20";

window.amazonLink = function (asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${window.AFFILIATE_TAG}`;
};
