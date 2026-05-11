// main.js
import { runCodeReview } from "./agent2.js";

const testData = [
  {
    fileName: "auth_logic.py",
    content: "def check_password(input, actual):\n    return input == actual",
    path: "src/auth/",
    projectId: "123",
  },
  {
    fileName: "db_helper.js",
    content: "const query = 'SELECT * FROM users WHERE id = ' + id;",
    path: "src/utils/",
    projectId: "123",
  },
];

// Run the review
runCodeReview(testData)
  .then((issues) => {
    console.log("\nProcess Finished.");
  })
  .catch((err) => {
    console.error("Error running review:", err);
  });
