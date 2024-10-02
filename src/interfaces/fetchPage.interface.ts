export interface IFetchOptions {
  url: string;
  outputDir: string;
  maxRetries?: number;
  showMetadata?: boolean;
}

export interface IAssetInfo {
  originalUrl: string;
  localPath: string;
}
