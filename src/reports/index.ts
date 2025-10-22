import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import {
  getLighthouseCategoryScore,
  getLighthouseReport,
  startChrome,
  stopChrome,
} from './lighthouse.js';
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

    let urls: unknown;
    if (Array.isArray(data)) {
      urls = data;
    } else if (typeof data === 'object' && data !== null) {
      urls = (data as Record<string, unknown>).urls;
    } else {
      console.error('Invalid JSON structure');
      return [];
    }

    if (!Array.isArray(urls)) {
      console.warn('URLs data is not an array');
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
export async function processUrls(urls: URLEntry[]): Promise<ProcessedURL[]> {
  const isoTimestamp: string = new Date().toISOString();
  // To minimize expensive async work, process URLs sequentially and reuse a
  // single Chrome instance when possible (started by generateReport).
  const results: ProcessedURL[] = [];

  for (const entry of urls) {
    // call lighthouse functions here to get real scores
    let performanceScore: number = 0;
    let accessibilityScore: number = 0;
    let bestPracticesScore: number = 0;

    try {
      // If generateReport started Chrome it will pass a debugging port via
      // an environment variable; otherwise getLighthouseReport will launch
      // a short-lived instance internally.
      const debugPortEnv = process.env.LIGHTHOUSE_DEBUG_PORT
        ? Number(process.env.LIGHTHOUSE_DEBUG_PORT)
        : undefined;
      console.log(` 🔭 Processing URL: ${entry.url}`);
      console.log(`  📡 Obtaining Lighthouse report`);
      const lhr = await getLighthouseReport(entry.url, debugPortEnv);
      console.log(`  ⚒️  Extracting Lighthouse scores from report`);
      performanceScore = getLighthouseCategoryScore(lhr, 'performance');
      accessibilityScore = getLighthouseCategoryScore(lhr, 'accessibility');
      bestPracticesScore = getLighthouseCategoryScore(lhr, 'best-practices');
    } catch (error) {
      console.error(`Failed to get Lighthouse for ${entry.url}:`, error);
      // scores remain 0 for this URL
    }

    const processed: ProcessedURL = {
      url: entry.url,
      dateLastVisited: isoTimestamp,
      scores: {
        performance: performanceScore,
        accessibility: accessibilityScore,
        bestPractices: bestPracticesScore,
      },
    };
    if (entry.name !== undefined) {
      processed.name = entry.name;
    }

    console.log(`  📇 Processed URL: ${processed.url}`);
    results.push(processed);
  }

  return results;
}

/**
 * Generates a report by reading URLs, processing them, and saving to a file.
 * @param inputPath Path to the input JSON file with URLs
 * @returns Report object containing metadata and processed URLs
 */
export async function generateReport(inputPath: string): Promise<Report> {
  try {
    const urls: URLEntry[] = readUrls(inputPath);

    // Start a single Chrome instance to be reused for all lighthouse runs. We
    // expose the port to the child calls via an env var so helper functions
    // can remain simple.
    let port: number | undefined;
    try {
      port = await startChrome();
      process.env.LIGHTHOUSE_DEBUG_PORT = String(port);
      console.log(`🚀 Started Chrome on port ${port}`);
    } catch (startError) {
      console.warn('Could not start shared Chrome instance, proceeding per-run:', startError);
      port = undefined;
    }

    const processedUrls: ProcessedURL[] = await processUrls(urls);

    // Stop the shared Chrome instance if we successfully started it.
    if (port) {
      try {
        await stopChrome();
        delete process.env.LIGHTHOUSE_DEBUG_PORT;
        console.log('🪂 Stopped shared Chrome instance');
      } catch (stopError) {
        console.warn('Error stopping Chrome:', stopError);
      }
    }

    const report: Report = {
      generatedAt: new Date().toISOString(),
      totalUrls: processedUrls.length,
      urls: processedUrls,
    };

    const absoluteOutputPath: string = resolve(inputPath.replace(/urls\.json$/, 'lhr.json'));
    writeFileSync(absoluteOutputPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`🎖️  Report generated and saved to ${absoluteOutputPath}`);
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
