const NAV_BUILDER = {
  basePath: "/shopppingonline/",

  links: {
    home: "index.html",
    vacuum: "best-vacuum-cleaners-en.html",
    coffee: "best-coffee-makers-en.html",
    survival: "best-solar.html",
    ringlight: "best-ring-lights-for-phone-en.html"
  },

  /**
   * Build safe internal URL (prevents 404s)
   */
  getUrl: function (key) {
    const page = this.links[key];
    if (!page) return this.basePath;

    return this.basePath + page;
  },

  /**
   * Inject navbar into page
   */
  render: function (containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <nav style="
        display:flex;
        gap:12px;
        flex-wrap:wrap;
        padding:10px 0;
        font-family:system-ui;
      ">
        <a href="${this.getUrl('home')}">Home</a>
        <a href="${this.getUrl('vacuum')}">Vacuum Cleaners</a>
        <a href="${this.getUrl('coffee')}">Coffee Makers</a>
        <a href="${this.getUrl('survival')}">Survival Gear</a>
        <a href="${this.getUrl('ringlight')}">Ring Lights</a>
      </nav>
    `;
  }
};
