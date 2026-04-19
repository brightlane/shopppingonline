// Step 1: Import the 'axios' library
const axios = require('axios');

// Example API URL (Replace with your actual API or data source)
const apiUrl = 'https://jsonplaceholder.typicode.com/todos/1';

// Step 2: Make an HTTP GET request using 'axios'
axios.get(apiUrl)
  .then(response => {
    // Success: Output the response data
    console.log('Data:', response.data);
  })
  .catch(error => {
    // Error: Output the error message
    console.error('Error fetching data:', error);
  });
