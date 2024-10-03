import { fetchPage } from "./utils/fetchPage.util";
import { parseArguments } from "./utils/argsParser.util";

// Mocking dependencies
jest.mock("./utils/fetchPage.util");
jest.mock("./utils/argsParser.util");

describe("Main Function in fetch.ts", () => {
  const mockUrls = ["https://example.com", "https://another.com"];
  const mockOutputDir = "output-dir";
  const mockMaxRetries = 3;
  const mockShowMetadata = false;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call fetchPage for each URL provided by parseArguments", async () => {
    // Mock `parseArguments` to return controlled values
    (parseArguments as jest.Mock).mockReturnValue({
      urls: mockUrls,
      outputDir: mockOutputDir,
      maxRetries: mockMaxRetries,
      showMetadata: mockShowMetadata,
    });

    // Mock `fetchPage` to resolve without actually doing anything
    (fetchPage as jest.Mock).mockResolvedValue(undefined);

    // Use `jest.isolateModules` to isolate import of `fetch.ts`
    await jest.isolateModules(async () => {
      const { main } = await import("./fetch");
      await main();
    });

    // Check if `fetchPage` was called the expected number of times
    expect(fetchPage).toHaveBeenCalledTimes(mockUrls.length);

    // Ensure `fetchPage` was called with the correct arguments for each URL
    mockUrls.forEach((url) => {
      expect(fetchPage).toHaveBeenCalledWith({
        url,
        outputDir: mockOutputDir,
        maxRetries: mockMaxRetries,
        showMetadata: mockShowMetadata,
      });
    });
  });
});
