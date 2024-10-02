import fs from "fs";
import path from "path";

/**
 * Ensures that a directory exists. If not, it creates the directory recursively.
 * @param dirPath - The path of the directory to ensure.
 */
export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Saves data to a file, ensuring that the directory exists.
 * @param filePath - The path of the file to save.
 * @param data - The data to write to the file.
 */
export function saveFile(filePath: string, data: Buffer | string): void {
  ensureDirectoryExists(path.dirname(filePath));
  fs.writeFileSync(filePath, data);
}
