// Import the 'axios' library
const axios = require('axios');

// Define the API URL (you can replace this with your actual URL)
const apiUrl = 'https://jsonplaceholder.typicode.com/todos/1';  // Example URL for testing

// Make the GET request using axios
axios.get(apiUrl)
  .then((response) => {
    // Log the response if it's successful
    console.log('Data received:', response.data);
  })
  .catch((error) => {
    // Log the error if something goes wrong
    console.error('Error fetching data:', error);
  });
