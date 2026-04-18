const fs = require('fs');
const path = require('path');
const axios = require('axios'); // For WordPress publishing (via REST API)
const execSync = require('child_process').execSync; // For GitHub pages push

const AUTO_PUBLISHER_ENGINE = {
  
  /**
   * SETTINGS
   */
  settings: {
    useWordPress: false, // Set to true if using WordPress for auto-publishing
    githubRepo: "your-github-repo", // GitHub repository name for pages
    wordpressApiUrl: "https://your-wordpress-site.com/wp-json/wp/v2/posts", // WordPress API endpoint
    wordpressAuthToken: "your-wordpress-auth-token", // WordPress API authorization token
    publishInterval: 30, // Number of minutes between each article publish (set 0 for immediate)
  },

  log: function (msg) {
    console.log("[PUBLISHER]", msg);
  },

  /**
   * MAIN PUBLISH FUNCTION
   */
  publish: function (articles) {
    this.log("🚀 Publishing articles...");

    const publishMethod = this.settings.useWordPress ? this.publishToWordPress : this.publishToGitHub;

    articles.forEach(article => {
      this.log(`Publishing article: ${article.title}`);

      setTimeout(() => {
        publishMethod(article);
      }, this.settings.publishInterval * 60 * 1000);
    });
  },

  /**
   * PUBLISH ARTICLE TO WORDPRESS
   */
  publishToWordPress: function (article) {
    this.log(`Publishing to WordPress: ${article.title}`);

    axios.post(this.settings.wordpressApiUrl, {
      title: article.title,
      content: article.content,
      status: "publish",
    }, {
      headers: {
        "Authorization": `Bearer ${this.settings.wordpressAuthToken}`
      }
    }).then(response => {
      this.log(`Article published on WordPress: ${article.title}`);
    }).catch(error => {
      this.log(`Error publishing to WordPress: ${error.message}`);
    });
  },

  /**
   * PUBLISH ARTICLE TO GITHUB PAGES
   */
  publishToGitHub: function (article) {
    this.log(`Publishing to GitHub Pages: ${article.title}`);

    const articlePath = path.join(__dirname, "content", `${article.id}.md`);
    const content = `
# ${article.title}

${article.content}
    `;

    // Write article to file
    fs.writeFileSync(articlePath, content, 'utf-8');
    this.log(`Article file created: ${articlePath}`);

    // Commit the article to the GitHub repository
    execSync(`git add ${articlePath}`);
    execSync('git commit -m "Add new article: ' + article.title + '"');
    execSync('git push origin main');
    this.log(`Article published on GitHub Pages: ${article.title}`);

    // Optionally trigger sitemap generation here (to update automatically)
    this.generateSitemap();
  },

  /**
   * GENERATE A SITEMAP FOR SEO
   */
  generateSitemap: function () {
    const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-site.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Add URLs of published articles here -->
</urlset>
    `;

    const sitemapPath = path.join(__dirname, "sitemap.xml");

    // Write sitemap to file
    fs.writeFileSync(sitemapPath, sitemap, 'utf-8');
    this.log(`Sitemap generated: ${sitemapPath}`);

    // Commit sitemap update to GitHub (for GitHub Pages)
    execSync(`git add ${sitemapPath}`);
    execSync('git commit -m "Update sitemap"');
    execSync('git push origin main');
  },

  /**
   * AUTO-SCHEDULE ARTICLES (EXAMPLE USAGE)
   */
  autoSchedule: function (articles) {
    this.log("🕐 Scheduling articles...");

    const scheduledArticles = this.scheduleArticles(articles);

    this.publish(scheduledArticles);
  },

  /**
   * SCHEDULE ARTICLES BASED ON INTERVALS
   */
  scheduleArticles: function (articles) {
    const scheduledArticles = articles.map((article, index) => {
      const delayTime = index * this.settings.publishInterval * 60 * 1000;
      return {
        ...article,
        scheduledTime: Date.now() + delayTime
      };
    });

    return scheduledArticles;
  }
};

module.exports = AUTO_PUBLISHER_ENGINE;
