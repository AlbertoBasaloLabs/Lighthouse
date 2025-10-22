import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import type { ProcessedURL, Report, URLEntry } from './types.js';

/**
 * Reads URLs from a JSON file.
 * @param filePath Path to the JSON file containing URLs
 * @returns Array of URL entries, empty array if 'urls' property is missing
 */
export function readUrls(filePath: string): URLEntry[] {
  try {
    ensurePathFolderExists(filePath);
    const absolutePath: string = resolve(filePath);
    const fileContent: string = readFileSync(absolutePath, 'utf-8');
    const data: unknown = JSON.parse(fileContent);

    if (typeof data !== 'object' || data === null) {
      console.error('Invalid JSON structure: root must be an object');
      return [];
    }

    const urls: unknown = (data as Record<string, unknown>).urls;

    if (!Array.isArray(urls)) {
      console.warn('Missing or invalid "urls" property in JSON file');
      return [];
    }
    console.log(`Read ${urls.length} URLs from ${filePath}`);
    return urls as URLEntry[];
  } catch (error) {
    console.error(`Error reading URLs from ${filePath}:`, error);
    return [];
  }
}

/**
 * Generates a random score between 0 and 100.
 * @returns Random score value
 */
export function generateRandomScore(): number {
  return Math.floor(Math.random() * 101);
}

/**
 * Processes URLs by adding timestamps and mock scores.
 * @param urls Array of URL entries to process
 * @returns Array of processed URLs with scores and timestamps
 */
export function processUrls(urls: URLEntry[]): ProcessedURL[] {
  const isoTimestamp: string = new Date().toISOString();

  return urls.map((entry: URLEntry): ProcessedURL => {
    const processed: ProcessedURL = {
      url: entry.url,
      dateLastVisited: isoTimestamp,
      scores: {
        performance: generateRandomScore(),
        accessibility: generateRandomScore(),
        bestPractices: generateRandomScore(),
      },
    };

    if (entry.name !== undefined) {
      processed.name = entry.name;
    }

    console.log(`Processed URL: ${processed.url}`);

    return processed;
  });
}

/**
 * Generates a report by reading URLs, processing them, and saving to a file.
 * @param inputPath Path to the input JSON file with URLs
 * @returns Report object containing metadata and processed URLs
 */
export function generateReport(inputPath: string): Report {
  try {
    const urls: URLEntry[] = readUrls(inputPath);
    const processedUrls: ProcessedURL[] = processUrls(urls);

    const report: Report = {
      generatedAt: new Date().toISOString(),
      totalUrls: processedUrls.length,
      urls: processedUrls,
    };

    const absoluteOutputPath: string = resolve(inputPath);
    writeFileSync(absoluteOutputPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`Report generated and saved to ${inputPath}`);
    return report;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}

function ensurePathFolderExists(path: string): void {
  const dir = resolve(path, '..');
  mkdirSync(dir, { recursive: true });
}
