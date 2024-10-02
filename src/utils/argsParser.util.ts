import fs from "fs";
import { IParsedArguments } from "../interfaces/general.interface";

/**
 * Parses command-line arguments and returns URLs and options.
 * @param args - The command-line arguments.
 * @returns An object containing URLs, output directory, and max retries.
 */
export function parseArguments(args: string[]): IParsedArguments {
  if (args.length === 0) {
    console.error(
      "Usage: npm run fetch -- <url1> <url2> [--output-dir=path] [--retries=number]"
    );
    process.exit(1);
  }

  const urls = args.filter((arg) => !arg.startsWith("--"));
  const optionsArgs = args.filter((arg) => arg.startsWith("--"));

  // Default options
  let outputDir = "web-pages";
  let maxRetries = 3;

  // Parse options
  optionsArgs.forEach((option) => {
    if (option.startsWith("--output-dir=")) {
      outputDir = option.split("=")[1];
    } else if (option.startsWith("--retries=")) {
      maxRetries = parseInt(option.split("=")[1], 10);
    }
  });

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  return {
    urls,
    outputDir,
    maxRetries,
  };
}
