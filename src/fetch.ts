import { fetchPage } from "./utils/fetchPage.util";
import { parseArguments } from "./utils/argsParser.util";

export async function main(): Promise<void> {
  const { urls, outputDir, maxRetries, showMetadata } = parseArguments(process.argv.slice(2));

  // Fetch pages
  const fetchPromises = urls.map((url) =>
    fetchPage({ url, outputDir, maxRetries, showMetadata })
  );

  await Promise.all(fetchPromises);
}

main().catch((error) => {
  // Consider providing more context in the error message or exiting the process with a non-zero exit code to indicate failure.
  console.error("An unexpected error occurred:", error);
  process.exit(1);
});
