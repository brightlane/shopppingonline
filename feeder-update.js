const axios = require("axios");

const apiUrl = "https://jsonplaceholder.typicode.com/todos/1";

async function run() {
  try {
    const response = await axios.get(apiUrl);
    console.log("Data received:", response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    process.exit(1);
  }
}

run();
