import fs from "fs";
import { ensureDirectoryExists, saveFile } from "./file.util";

jest.mock("fs");

describe("File Utility Functions", () => {
  const testPath = "/some/path";
  const testFilePath = "/some/path/file.txt";
  const testData = "Test data";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("ensureDirectoryExists", () => {
    const mockFsExistsSync = (exists: boolean) => {
      (fs.existsSync as jest.Mock).mockReturnValue(exists);
    };

    it("should create the directory if it does not exist", () => {
      mockFsExistsSync(false);

      ensureDirectoryExists(testPath);

      expect(fs.mkdirSync).toHaveBeenCalledWith(testPath, {
        recursive: true,
      });
    });

    it("should not create the directory if it already exists", () => {
      mockFsExistsSync(true);

      ensureDirectoryExists(testPath);

      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe("saveFile", () => {
    const mockFsWriteFileSync = () => {
      (fs.writeFileSync as jest.Mock).mockImplementation(() => undefined);
    };

    it("should save data to a file and ensure the directory exists", () => {
      // Mock fs functions
      (fs.existsSync as jest.Mock).mockReturnValue(true); // Assume directory exists
      mockFsWriteFileSync();

      saveFile(testFilePath, testData);

      // Expect fs.writeFileSync to be called with the correct file path and data
      expect(fs.writeFileSync).toHaveBeenCalledWith(testFilePath, testData);
    });

    it("should create directory if it doesn't exist before saving the file", () => {
      // Assume directory does not exist initially
      (fs.existsSync as jest.Mock)
        .mockReturnValueOnce(false)
        .mockReturnValue(true);

      // Mock mkdirSync and writeFileSync
      (fs.mkdirSync as jest.Mock).mockImplementation(() => undefined);
      mockFsWriteFileSync();

      saveFile(testFilePath, testData);

      // Expect mkdirSync to be called to create the directory
      expect(fs.mkdirSync).toHaveBeenCalledWith(testPath, { recursive: true });

      // Expect writeFileSync to save the file after ensuring the directory exists
      expect(fs.writeFileSync).toHaveBeenCalledWith(testFilePath, testData);
    });
  });
});
