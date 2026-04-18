const axios = require('axios');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');

const SEO_OPTIMIZER = {
  /**
   * SETTINGS
   */
  settings: {
    seoApiEndpoint: "https://your-seo-api-endpoint.com/optimize", // Replace with your SEO optimization API
    defaultMetaDescriptionLength: 160, // Default length for SEO meta descriptions
    defaultCategories: ['Tech', 'Reviews', 'Guides', 'Comparisons'], // Default categories for articles
    defaultTags: ['affiliate', 'reviews', 'buying guide', 'product comparison'] // Default tags for articles
  },

  log: function (msg) {
    console.log("[SEO OPTIMIZER]", msg);
  },

  /**
   * MAIN FUNCTION THAT WILL BE CALLED TO OPTIMIZE ARTICLES
   */
  optimizeArticles: function (articles) {
    this.log("🚀 Starting SEO optimization...");

    const optimizedArticles = articles.map(article => {
      article.slug = this.generateSlug(article.title);
      article.metaDescription = this.generateMetaDescription(article.content);
      article.categories = this.assignCategories(article.title);
      article.tags = this.assignTags(article.title);
      article.seoFriendlyUrl = this.generateSeoFriendlyUrl(article.slug);
      article = this.seoAudit(article);
      return article;
    });

    this.log(`✅ SEO optimization complete for ${optimizedArticles.length} articles.`);

    return optimizedArticles;
  },

  /**
   * GENERATE SLUG (SEO FRIENDLY URL PART)
   */
  generateSlug: function (title) {
    return slugify(title, { lower: true, strict: true });
  },

  /**
   * GENERATE META DESCRIPTION (SEO META TAG)
   */
  generateMetaDescription: function (content) {
    const metaDescription = content.slice(0, this.settings.defaultMetaDescriptionLength);
    return metaDescription + (metaDescription.length < this.settings.defaultMetaDescriptionLength ? "" : "...");
  },

  /**
   * ASSIGN CATEGORIES TO ARTICLE
   * Uses simple keyword matching or you could integrate an API for better categorization
   */
  assignCategories: function (title) {
    const lowerTitle = title.toLowerCase();

    const categories = this.settings.defaultCategories.filter(category => 
      lowerTitle.includes(category.toLowerCase())
    );

    return categories.length > 0 ? categories : this.settings.defaultCategories; // Fallback to default categories
  },

  /**
   * ASSIGN TAGS TO ARTICLE
   * Similar logic as categories, but focuses on more granular keywords or product-related tags
   */
  assignTags: function (title) {
    const lowerTitle = title.toLowerCase();

    const tags = this.settings.defaultTags.filter(tag => 
      lowerTitle.includes(tag.toLowerCase())
    );

    return tags.length > 0 ? tags : this.settings.defaultTags; // Fallback to default tags
  },

  /**
   * GENERATE SEO FRIENDLY URL BASED ON SLUG
   */
  generateSeoFriendlyUrl: function (slug) {
    return `https://your-website.com/articles/${slug}`;
  },

  /**
   * SEO AUDIT - Use an API to audit SEO performance of the article
   * E.g., using Lighthouse or a custom API to evaluate content quality
   */
  seoAudit: function (article) {
    this.log(`🔍 Running SEO audit for article: ${article.title}`);

    // Example API call to SEO optimization service
    axios.post(this.settings.seoApiEndpoint, {
      title: article.title,
      content: article.content,
      slug: article.slug,
      metaDescription: article.metaDescription,
      categories: article.categories,
      tags: article.tags,
      seoFriendlyUrl: article.seoFriendlyUrl
    }).then(response => {
      this.log(`SEO audit passed for: ${article.title}`);
      article.seoScore = response.data.seoScore;
      article.auditResults = response.data.auditResults; // Store detailed audit results
    }).catch(error => {
      this.log(`Error running SEO audit for article: ${article.title}`);
      article.seoScore = 0;
    });

    return article;
  },

  /**
   * SAVE ARTICLE WITH SEO DATA TO FILE (for GitHub, WordPress, etc.)
   */
  saveArticleWithSeoData: function (article) {
    const articlePath = path.join(__dirname, "content", `${article.slug}.md`);

    const articleContent = `
# ${article.title}

## Meta Description
${article.metaDescription}

## Categories
${article.categories.join(", ")}

## Tags
${article.tags.join(", ")}

[Read More]( ${article.seoFriendlyUrl} )

${article.content}
    `;

    // Write the article content with SEO data to a file
    fs.writeFileSync(articlePath, articleContent, 'utf-8');
    this.log(`Article saved with SEO data: ${articlePath}`);
  }
};

module.exports = SEO_OPTIMIZER;
