import axios from "axios";
import path from "path";
import { downloadAsset, downloadAssetWithRetry } from "./assetDownloader.util";
import { saveFile } from "./file.util";

// Mock modules
jest.mock("axios");
jest.mock("./file.util");

describe("Asset Downloader Utilities", () => {
  const mockData = Buffer.from("test data");
  const assetUrl = "http://example.com/assets/image.png";
  const siteDir = "/local/site/dir";
  const errorMessage = "Network error";
  const fullLocalPath = "/local/site/dir/assets/image.png";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Utility functions to mock axios behavior
  const mockAxiosSuccess = () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });
  };

  const mockAxiosFailure = () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));
  };

  const mockAxiosRetry = () => {
    (axios.get as jest.Mock)
      .mockRejectedValueOnce(new Error(errorMessage)) // First call fails
      .mockResolvedValueOnce({ data: mockData }); // Second call succeeds
  };

  // Utility function to spy on console methods
  const spyOnConsole = (method: "warn" | "error") => {
    return jest.spyOn(console, method).mockImplementation(() => {});
  };

  describe("downloadAsset", () => {
    it("should download an asset and save it to the local file system", async () => {
      mockAxiosSuccess();

      // Spy on path.join
      const joinSpy = jest.spyOn(path, "join").mockReturnValue(fullLocalPath);

      await downloadAsset(assetUrl, siteDir);

      // Ensure axios.get was called with the correct parameters
      expect(axios.get).toHaveBeenCalledWith(assetUrl, {
        responseType: "arraybuffer",
      });

      // Ensure saveFile was called with the correct path and data
      expect(saveFile).toHaveBeenCalledWith(fullLocalPath, mockData);

      joinSpy.mockRestore();
    });

    it("should throw an error if axios.get fails", async () => {
      mockAxiosFailure();

      // Expect downloadAsset to throw an error
      await expect(downloadAsset(assetUrl, siteDir)).rejects.toThrow(
        errorMessage
      );

      // Ensure saveFile is not called
      expect(saveFile).not.toHaveBeenCalled();
    });
  });

  describe("downloadAssetWithRetry", () => {
    it("should retry downloading an asset if an error occurs", async () => {
      mockAxiosRetry();

      // Spy on console.warn
      const consoleWarnSpy = spyOnConsole("warn");

      await downloadAssetWithRetry(assetUrl, siteDir, 1);

      // Expect axios.get to be called twice (one retry)
      expect(axios.get).toHaveBeenCalledTimes(2);

      // Ensure console.warn was called with correct message
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `Retrying ${assetUrl}, retries left: 0`
      );

      consoleWarnSpy.mockRestore();
    });

    it("should stop retrying after retriesLeft reaches zero", async () => {
      mockAxiosFailure();

      // Spy on console.warn and console.error
      const consoleWarnSpy = spyOnConsole("warn");
      const consoleErrorSpy = spyOnConsole("error");

      await downloadAssetWithRetry(assetUrl, siteDir, 1);

      // Ensure axios.get was called correct number of times (initial + retry)
      expect(axios.get).toHaveBeenCalledTimes(2);

      // Ensure console.warn was called with correct message
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `Retrying ${assetUrl}, retries left: 0`
      );

      // Ensure console.error was called with correct message
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Failed to download asset ${assetUrl}: ${errorMessage}`
      );

      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });
});
