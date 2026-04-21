const axios = require("axios");
const fs = require("fs");

const apiUrl = "https://jsonplaceholder.typicode.com/todos/1";

async function run() {
  try {
    const { data } = await axios.get(apiUrl);

    // Save data to a file instead of just printing
    fs.writeFileSync(
      "data.json",
      JSON.stringify(data, null, 2)
    );

    console.log("Data saved to data.json");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

run();
