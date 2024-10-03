import { countOccurrences, collectMetadata } from "./metadata.util";
import { IMetadata } from "../interfaces/general.interface";

describe("Metadata Utilities", () => {
  describe("countOccurrences", () => {
    const scenarios = [
      {
        description: "should return 0 when no matches are found",
        text: "<p>No links here</p>",
        regex: /<a\b[^>]*href=['"][^'"]*['"][^>]*>/gi,
        expected: 0,
      },
      {
        description: "should count all link elements correctly",
        text: '<a href="https://example.com">Link 1</a><a href="https://example.org">Link 2</a>',
        regex: /<a\b[^>]*href=['"][^'"]*['"][^>]*>/gi,
        expected: 2,
      },
      {
        description: "should count all img elements correctly",
        text: '<img src="image1.png" /><img src="image2.png" />',
        regex: /<img\b[^>]*src=['"][^'"]*['"][^>]*>/gi,
        expected: 2,
      },
      {
        description: "should return 0 for regex patterns that do not match",
        text: "<p>No images or links here</p>",
        regex: /<a\b[^>]*href=['"][^'"]*['"][^>]*>/gi,
        expected: 0,
      },
    ];

    scenarios.forEach(({ description, text, regex, expected }) => {
      it(description, () => {
        const result = countOccurrences(text, regex);
        expect(result).toBe(expected);
      });
    });
  });

  describe("collectMetadata", () => {
    it("should correctly collect the number of links and images", () => {
      const htmlContent = `
        <html>
          <body>
            <a href="https://example.com">Example</a>
            <a href="https://another-example.com">Another</a>
            <img src="image1.png" />
            <img src="image2.png" />
          </body>
        </html>
      `;

      const expectedMetadata: Omit<IMetadata, "lastFetch"> = {
        numLinks: 2,
        numImages: 2,
      };

      const result = collectMetadata(htmlContent);

      // Check number of links and images
      expect(result.numLinks).toBe(expectedMetadata.numLinks);
      expect(result.numImages).toBe(expectedMetadata.numImages);

      // Check lastFetch is a valid date
      expect(result.lastFetch).toBeInstanceOf(Date);
    });

    it("should return zero counts for HTML content with no links or images", () => {
      const htmlContent =
        "<html><body><p>No links or images here</p></body></html>";

      const expectedMetadata: Omit<IMetadata, "lastFetch"> = {
        numLinks: 0,
        numImages: 0,
      };

      const result = collectMetadata(htmlContent);

      // Check number of links and images
      expect(result.numLinks).toBe(expectedMetadata.numLinks);
      expect(result.numImages).toBe(expectedMetadata.numImages);

      // Check lastFetch is a valid date
      expect(result.lastFetch).toBeInstanceOf(Date);
    });

    it("should handle malformed HTML and still return correct counts", () => {
      const htmlContent = `
        <html>
          <body>
            <a href='https://example.com'>Unclosed link tag
            <img src='image1.png'>
          </body>
        </html>
      `;

      const expectedMetadata: Omit<IMetadata, "lastFetch"> = {
        numLinks: 1,
        numImages: 1,
      };

      const result = collectMetadata(htmlContent);

      // Check number of links and images
      expect(result.numLinks).toBe(expectedMetadata.numLinks);
      expect(result.numImages).toBe(expectedMetadata.numImages);

      // Check lastFetch is a valid date
      expect(result.lastFetch).toBeInstanceOf(Date);
    });
  });
});
