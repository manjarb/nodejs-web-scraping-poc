import axios from "axios";
import fs from "fs";
import path from "path";

// Function to fetch a single URL and save the HTML content
export async function fetchPage(url: string): Promise<void> {
  try {
    // Fetch HTML content from the URL
    const response = await axios.get(url);

    // Parse the URL to get the hostname (e.g., google.com)
    const hostname = new URL(url).hostname;

    // Construct the filename
    const filename = path.join("web-pages", `${hostname}.html`);

    // Save HTML content to disk
    fs.writeFileSync(filename, response.data);
    console.log(`Saved: ${filename}`);
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
  }
}
