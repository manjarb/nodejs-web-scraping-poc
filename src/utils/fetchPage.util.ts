import axios from "axios";
import path from "path";
import { IFetchOptions } from "../interfaces/fetchPage.interface";
import { ensureDirectoryExists, saveFile } from "./file.util";
import { adjustAssetPaths } from "./html.util";
import { downloadAssetWithRetry } from "./assetDownloader.util";

/**
 * Fetches a web page and saves it along with its assets.
 * @param options - The options for fetching the page.
 */
export async function fetchPage({
  url,
  outputDir,
  maxRetries = 3,
}: IFetchOptions): Promise<void> {
  try {
    // Fetch HTML content
    const { data } = await axios.get<string>(url);
    let htmlContent = data;

    // Parse URL
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace("www.", "");

    // Site directory
    const siteDir = path.join(outputDir, hostname);
    ensureDirectoryExists(siteDir);

    // Extract and download assets
    const assetUrls = extractAssetUrls(htmlContent, url);
    await downloadAssets(assetUrls, siteDir, maxRetries);

    // Adjust HTML content
    htmlContent = adjustAssetPaths(htmlContent);

    // Save HTML
    const indexPath = path.join(siteDir, "index.html");
    saveFile(indexPath, htmlContent);

    console.log(`Downloaded site: ${url}`);
  } catch (error: any) {
    console.error(`Failed to fetch ${url}: ${error.message}`);
  }
}

/**
 * Extracts asset URLs from HTML content.
 * @param html - The HTML content.
 * @param baseUrl - The base URL for resolving relative URLs.
 * @returns An array of absolute asset URLs.
 */
function extractAssetUrls(html: string, baseUrl: string): string[] {
  const assetUrls: Set<string> = new Set();

  // Regular expression to find src and href attributes
  const srcHrefRegex = /(?:src|href)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^>\s]+))/gi;

  let match: RegExpExecArray | null;

  while ((match = srcHrefRegex.exec(html)) !== null) {
    const assetUrl = match[1];
    assetUrls.add(assetUrl);
  }


  // Filter out unwanted URLs and keep only specific asset types
  const filteredAssetUrls = Array.from(assetUrls).filter(
    (assetUrl) =>
      assetUrl &&
      !assetUrl.startsWith("#") &&
      !assetUrl.startsWith("data:") &&
      !assetUrl.startsWith("mailto:") &&
      isAssetTypeSupported(assetUrl)
  );

  // Convert to absolute URLs
  const absoluteAssetUrls = filteredAssetUrls
    .map((assetUrl) => {
      try {
        return new URL(assetUrl, baseUrl).href;
      } catch (error) {
        console.warn(`Invalid URL skipped: ${assetUrl}`);
        return null;
      }
    })
    .filter((url) => url !== null);

  return absoluteAssetUrls;
}

/**
 * Checks if the asset is of a supported type.
 * @param assetUrl - The asset URL to check.
 * @returns True if supported, false otherwise.
 */
function isAssetTypeSupported(assetUrl: string): boolean {
  const supportedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".svg",
    ".webp", // Images
    ".css", // CSS
    ".js", // JavaScript
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",
    ".eot", // Fonts
  ];
  const pathname = new URL(assetUrl, "http://example.com").pathname;
  return supportedExtensions.some((ext) =>
    pathname.toLowerCase().endsWith(ext)
  );
}

/**
 * Downloads all assets with concurrency control.
 * @param assetUrls - The list of asset URLs to download.
 * @param siteDir - The base directory for the site.
 * @param maxRetries - Maximum number of retries for each asset.
 */
async function downloadAssets(
  assetUrls: string[],
  siteDir: string,
  maxRetries: number
): Promise<void> {
  // Limit concurrency
  const concurrencyLimit = 5;
  const queue = [...assetUrls];

  const downloadPromises = Array.from({ length: concurrencyLimit }).map(() =>
    (async () => {
      while (queue.length > 0) {
        const assetUrl = queue.shift()!;
        await downloadAssetWithRetry(assetUrl, siteDir, maxRetries);
      }
    })()
  );

  await Promise.all(downloadPromises);
}
