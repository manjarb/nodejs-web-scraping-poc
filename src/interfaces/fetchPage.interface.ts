export interface IFetchOptions {
  url: string;
  outputDir: string;
  maxRetries?: number;
}

export interface IAssetInfo {
  originalUrl: string;
  localPath: string;
}
