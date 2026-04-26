const fs = require("fs");

const apiUrl = "https://jsonplaceholder.typicode.com/todos/1";

async function run() {
  try {
    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();

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
