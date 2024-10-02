import axios from "axios";
import path from "path";
import { saveFile } from "./file.util";

/**
 * Downloads an asset and saves it to the local file system.
 * @param assetUrl - The URL of the asset to download.
 * @param siteDir - The base directory for the site.
 */
export async function downloadAsset(
  assetUrl: string,
  siteDir: string
): Promise<void> {
  const assetResponse = await axios.get(assetUrl, {
    responseType: "arraybuffer",
  });

  const assetUrlObj = new URL(assetUrl);
  const pathname = assetUrlObj.pathname;

  const localAssetPath = pathname.startsWith("/")
    ? pathname.substring(1)
    : pathname;

  const fullLocalPath = path.join(siteDir, localAssetPath);

  saveFile(fullLocalPath, assetResponse.data);
}

/**
 * Downloads an asset with retry logic.
 * @param assetUrl - The URL of the asset to download.
 * @param siteDir - The base directory for the site.
 * @param retriesLeft - Number of retries left.
 */
export async function downloadAssetWithRetry(
  assetUrl: string,
  siteDir: string,
  retriesLeft: number
): Promise<void> {
  try {
    await downloadAsset(assetUrl, siteDir);
    // eslint-disable-next-line
  } catch (error: any) {
    if (retriesLeft > 0) {
      console.warn(`Retrying ${assetUrl}, retries left: ${retriesLeft - 1}`);
      await downloadAssetWithRetry(assetUrl, siteDir, retriesLeft - 1);
    } else {
      console.error(`Failed to download asset ${assetUrl}: ${error.message}`);
    }
  }
}
