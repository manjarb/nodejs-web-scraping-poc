export interface IParsedArguments {
  urls: string[];
  outputDir: string;
  maxRetries: number;
  showMetadata: boolean;
}

export interface IMetadata {
  numLinks: number;
  numImages: number;
  lastFetch: Date;
}
