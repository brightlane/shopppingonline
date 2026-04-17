const SITE_ENGINE = {
  initialized: false,

  init: async function () {
    if (this.initialized) return;
    this.initialized = true;

    console.log("🚀 BrightLane Site Engine Starting...");

    // Wait for dependencies safely
    await this.waitForDependencies();

    // Initialize systems safely
    this.initClickSystem();
    this.initTrending();
    this.initSEO();

    console.log("✅ BrightLane Site Engine Ready");
  },

  waitForDependencies: function () {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (
          typeof CLICK_SYSTEM !== "undefined" &&
          typeof TRENDING_ENGINE !== "undefined" &&
          typeof SEO_INJECTOR !== "undefined" &&
          typeof AFFILIATE_CONFIG !== "undefined"
        ) {
          clearInterval(check);
          resolve();
        }
      }, 50);
    });
  },

  initClickSystem: function () {
    console.log("✔ Click system loaded");
  },

  initTrending: function () {
    console.log("✔ Trending engine ready");
  },

  initSEO: function () {
    console.log("✔ SEO injector ready");
  }
};

// Auto-start on page load
window.addEventListener("DOMContentLoaded", () => {
  SITE_ENGINE.init();
});
