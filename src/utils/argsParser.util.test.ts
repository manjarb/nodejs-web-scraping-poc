import fs from "fs";
import { parseArguments } from "./argsParser.util";
import { IParsedArguments } from "../interfaces/general.interface";

describe("parseArguments", () => {
  beforeEach(() => {
    // Mock fs.mkdirSync to prevent actual directory creation
    jest.spyOn(fs, "mkdirSync").mockImplementation(() => undefined);

    // Mock process.exit to prevent exiting during tests
    jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Process exited");
    });

    // Mock console.error to suppress error output during tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore all mocks to original state
    jest.restoreAllMocks();
  });

  it("should parse URLs and use default options when no options are provided", () => {
    const args = ["https://example.com", "https://example.org"];
    const expected: IParsedArguments = {
      urls: ["https://example.com", "https://example.org"],
      outputDir: "web-pages",
      maxRetries: 3,
      showMetadata: false,
    };

    const result = parseArguments(args);
    expect(result).toEqual(expected);
  });

  it("should parse URLs and options correctly", () => {
    const args = [
      "https://example.com",
      "--output-dir=custom-dir",
      "--retries=5",
      "--metadata",
    ];
    const expected: IParsedArguments = {
      urls: ["https://example.com"],
      outputDir: "custom-dir",
      maxRetries: 5,
      showMetadata: true,
    };

    const result = parseArguments(args);
    expect(result).toEqual(expected);
  });

  it("should handle no arguments and exit with an error", () => {
    expect(() => parseArguments([])).toThrow("Process exited");
    expect(console.error).toHaveBeenCalledWith(
      "Usage: npm run fetch -- <url1> <url2> [--output-dir=path] [--retries=number]"
    );
  });

  it("should parse showMetadata correctly when --metadata is provided", () => {
    const args = ["https://example.com", "--metadata"];
    const expected: IParsedArguments = {
      urls: ["https://example.com"],
      outputDir: "web-pages",
      maxRetries: 3,
      showMetadata: true,
    };

    const result = parseArguments(args);
    expect(result).toEqual(expected);
  });

  it("should ignore unknown options without affecting other options", () => {
    const args = ["https://example.com", "--unknown-option"];
    const expected: IParsedArguments = {
      urls: ["https://example.com"],
      outputDir: "web-pages",
      maxRetries: 3,
      showMetadata: false,
    };

    const result = parseArguments(args);
    expect(result).toEqual(expected);
  });
});
