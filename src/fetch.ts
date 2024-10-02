import fs from "fs";
import { fetchPage } from "./utils/fetchPage";

// Main function to handle multiple URLs
async function main(): Promise<void> {
  const urls = process.argv.slice(2); // Get URLs from command line arguments

  // Ensure web-pages directory exists
  if (!fs.existsSync("web-pages")) {
    fs.mkdirSync("web-pages");
  }

  console.log(urls, ' :url');

  // Fetch each URL
  for (const url of urls) {
    await fetchPage(url);
  }
}

main();
