import { IMetadata } from "../interfaces/general.interface";

/**
 * Counts the number of occurrences of a pattern in a string.
 * @param text - The text to search.
 * @param regex - The regular expression pattern.
 * @returns The number of occurrences.
 */
export function countOccurrences(text: string, regex: RegExp): number {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Collects metadata from HTML content.
 * @param htmlContent - The HTML content of the page.
 * @returns An object containing metadata.
 */
export function collectMetadata(htmlContent: string): IMetadata {
  const numLinks = countOccurrences(
    htmlContent,
    /<a\b[^>]*href=['"][^'"]*['"][^>]*>/gi
  );
  const numImages = countOccurrences(
    htmlContent,
    /<img\b[^>]*src=['"][^'"]*['"][^>]*>/gi
  );
  const lastFetch = new Date();

  return {
    numLinks,
    numImages,
    lastFetch,
  };
}
