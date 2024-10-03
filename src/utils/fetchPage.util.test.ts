import axios from "axios";
import path from "path";
import { fetchPage } from "./fetchPage.util";
import { ensureDirectoryExists, saveFile } from "./file.util";
import { adjustAssetPaths } from "./html.util";
import { downloadAssetWithRetry } from "./assetDownloader.util";
import { collectMetadata } from "./metadata.util";

// Mock modules
jest.mock("axios");
jest.mock("./file.util");
jest.mock("./html.util");
jest.mock("./assetDownloader.util");
jest.mock("./metadata.util");

describe("fetchPage", () => {
  const mockHtmlContent = `
    <html>
      <head>
        <link href="/styles.css" rel="stylesheet" />
        <script src="/script.js"></script>
      </head>
      <body>
        <img src="/image.png" />
      </body>
    </html>`;
  const testUrl = "http://example.com";
  const testOutputDir = "output-dir";
  const testSiteDir = path.join(testOutputDir, "example.com");
  const testOptions = {
    url: testUrl,
    outputDir: testOutputDir,
    maxRetries: 3,
    showMetadata: true,
  };

  // Mock Data for Metadata
  const mockMetadata = {
    numLinks: 10,
    numImages: 5,
    lastFetch: new Date("2023-01-01T12:00:00Z"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  /**
   * Sets up common mocks for all tests.
   */
  const setupMocks = () => {
    // Mock axios.get to return mock HTML content
    (axios.get as jest.Mock).mockResolvedValue({ data: mockHtmlContent });

    // Mock file utility functions
    (ensureDirectoryExists as jest.Mock).mockImplementation(() => undefined);
    (saveFile as jest.Mock).mockImplementation(() => undefined);

    // Mock HTML adjustment function to return HTML as is
    (adjustAssetPaths as jest.Mock).mockImplementation((html) => html);

    // Mock download assets function to resolve immediately
    (downloadAssetWithRetry as jest.Mock).mockImplementation(() =>
      Promise.resolve()
    );

    // Mock metadata collection
    (collectMetadata as jest.Mock).mockReturnValue(mockMetadata);
  };

  it("should fetch a page and save its content and assets", async () => {
    await fetchPage(testOptions);

    // Ensure axios.get was called with the correct URL
    expect(axios.get).toHaveBeenCalledWith(testUrl);

    // Ensure the directory is created for the site
    expect(ensureDirectoryExists).toHaveBeenCalledWith(testSiteDir);

    // Ensure the HTML file is saved
    expect(saveFile).toHaveBeenCalledWith(
      path.join(testSiteDir, "index.html"),
      mockHtmlContent
    );

    // Ensure assets are downloaded
    expect(downloadAssetWithRetry).toHaveBeenCalled();
  });

  it("should fetch a page and save its metadata when showMetadata is true", async () => {
    await fetchPage(testOptions);

    // Ensure metadata is collected
    expect(collectMetadata).toHaveBeenCalledWith(mockHtmlContent);

    // Ensure the metadata file is saved
    const metadataPath = path.join(testSiteDir, "metadata.json");
    const expectedMetadata = {
      site: new URL(testUrl),
      num_links: mockMetadata.numLinks,
      images: mockMetadata.numImages,
      last_fetch: mockMetadata.lastFetch.toISOString(),
    };
    expect(saveFile).toHaveBeenCalledWith(
      metadataPath,
      JSON.stringify(expectedMetadata, null, 2)
    );
  });

  it("should handle errors gracefully and log an error message", async () => {
    const errorMessage = "Network error";
    (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Mock console.error to avoid printing to the console
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await fetchPage(testOptions);

    // Ensure error message is logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Failed to fetch ${testUrl}: ${errorMessage}`
    );

    consoleErrorSpy.mockRestore();
  });
});
