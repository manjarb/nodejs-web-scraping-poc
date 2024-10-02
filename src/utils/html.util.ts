/**
 * Adjusts asset paths in the HTML content to ensure that assets load correctly from local files.
 * @param htmlContent - The original HTML content.
 * @returns The HTML content with adjusted asset paths.
 */
export function adjustAssetPaths(htmlContent: string): string {
  const regex = /((?:src|href)\s*=\s*)(["']?)([^"'\s>]+)\2/gi;

  const adjustedHtmlContent = htmlContent.replace(
    regex,
    (match, prefix, quote, url) => {
      // Ignore absolute URLs
      if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("data:") ||
        url.startsWith("mailto:")
      ) {
        return match;
      }

      // Convert protocol-relative URLs
      if (url.startsWith("//")) {
        return `${prefix}${quote}http:${url}${quote}`;
      }

      // Convert absolute paths to relative paths
      if (url.startsWith("/")) {
        const newUrl = `.${url}`;
        return `${prefix}${quote}${newUrl}${quote}`;
      }

      // Leave relative URLs unchanged
      return match;
    }
  );

  return adjustedHtmlContent;
}
