const fs = require('fs');
const path = require('path');

// Path to the feeders JSON file
const feedersFilePath = path.join(__dirname, 'feeders.json');
const htmlTemplatePath = path.join(__dirname, 'index.html');

// Function to update the HTML page with new product data
function updatePage() {
  fs.readFile(feedersFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading feeders file:', err);
      return;
    }
    
    const feeders = JSON.parse(data);
    let updatedHtml = '';
    
    // Generate the HTML content dynamically based on feeders
    feeders.forEach((product) => {
      updatedHtml += `
      <div class="pair">
        <a class="card" href="${product.link}">
          <div class="badge ${product.badge.toLowerCase()}">${product.badge}</div>
          <div class="title">${product.title}</div>
          <div class="desc">${product.description}</div>
          <div class="review">${product.review}</div>
        </a>
        <div class="vs">VS</div>
        <a class="card" href="${product.comparisonLink}">
          <div class="badge ${product.comparisonBadge.toLowerCase()}">${product.comparisonBadge}</div>
          <div class="title">${product.comparisonTitle}</div>
          <div class="desc">${product.comparisonDescription}</div>
          <div class="review">${product.comparisonReview}</div>
        </a>
      </div>`;
    });
    
    // Write the updated HTML to the index file
    fs.writeFile(htmlTemplatePath, updatedHtml, (err) => {
      if (err) {
        console.error('Error writing updated HTML:', err);
      } else {
        console.log('HTML file updated successfully!');
      }
    });
  });
}

// Call the function to update the page
updatePage();
