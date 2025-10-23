/**
 * Represents a URL entry from the input JSON file.
 */
export type URLEntry = {
  url: string;
  name: string;
};

/**
 * Represents Lighthouse scores for a URL.
 */
export type Score = {
  performance: number;
  accessibility: number;
  bestPractices: number;
};

/**
 * Represents a processed URL with scores and timestamp.
 */
export type ProcessedURL = {
  url: string;
  name: string;
  dateLastVisited: string;
  scores: Score;
};

/**
 * Represents the final report with metadata and processed URLs.
 */
export type Report = {
  generatedAt: string;
  totalUrls: number;
  urls: ProcessedURL[];
};
