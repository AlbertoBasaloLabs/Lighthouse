import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { LighthouseClient } from './lighthouse.js';
import type { ProcessedURL, Report, URLEntry } from './types.js';

export { LighthouseClient } from './lighthouse.js';

/**
 * Generates Lighthouse reports for multiple URLs.
 */
export class ReportGenerator {
  private readonly lighthouseClient: LighthouseClient;

  constructor(lighthouseClient: LighthouseClient) {
    this.lighthouseClient = lighthouseClient;
  }

  /**
   * Generate a report from URLs in input file.
   * @param inputPath Path to the input JSON file with URLs
   * @returns Report object containing metadata and processed URLs
   */
  public async generateReport(inputPath: string): Promise<Report> {
    await this.lighthouseClient.start();
    console.log('🚀 Started Chrome browser');

    try {
      const urlEntries: URLEntry[] = this.readUrls(inputPath);
      const processedUrls: ProcessedURL[] = await this.processUrls(urlEntries);
      const report: Report = this.saveReport(processedUrls, inputPath);
      return report;
    } finally {
      await this.lighthouseClient.stop();
      console.log('🪂 Stopped Chrome browser');
    }
  }

  private readUrls(filePath: string): URLEntry[] {
    this.ensurePathFolderExists(filePath);
    const absolutePath: string = resolve(filePath);
    const fileContent: string = readFileSync(absolutePath, 'utf-8');
    const urlEntries: URLEntry[] = JSON.parse(fileContent);
    return urlEntries;
  }

  private async processUrls(urlEntries: URLEntry[]): Promise<ProcessedURL[]> {
    const timestamp: string = new Date().toISOString();
    const processedUrls: ProcessedURL[] = [];

    for (const entry of urlEntries) {
      const processedUrl: ProcessedURL = await this.processUrl(entry, timestamp);
      processedUrls.push(processedUrl);
    }

    return processedUrls;
  }

  private async processUrl(entry: URLEntry, timestamp: string): Promise<ProcessedURL> {
    console.log(` 🔭 Processing URL: ${entry.url}`);

    const scores = {
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
    };

    try {
      console.log(`  📡 Running Lighthouse audit`);
      const report = await this.lighthouseClient.audit(entry.url);

      console.log(`  ⚒️  Extracting scores`);
      scores.performance = this.lighthouseClient.getCategoryScore(report, 'performance');
      scores.accessibility = this.lighthouseClient.getCategoryScore(report, 'accessibility');
      scores.bestPractices = this.lighthouseClient.getCategoryScore(report, 'best-practices');
    } catch (error) {
      console.error(`  ❌ Failed to audit ${entry.url}:`, error);
    }

    const processedUrl: ProcessedURL = {
      url: entry.url,
      dateLastVisited: timestamp,
      scores,
    };

    if (entry.name !== undefined) {
      processedUrl.name = entry.name;
    }

    console.log(`  ✅ Processed: ${processedUrl.url}`);
    return processedUrl;
  }

  private saveReport(processedUrls: ProcessedURL[], inputPath: string): Report {
    const report: Report = {
      generatedAt: new Date().toISOString(),
      totalUrls: processedUrls.length,
      urls: processedUrls,
    };

    const outputPath: string = resolve(inputPath.replace(/urls\.json$/, 'lhr.json'));
    writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`🎖️  Report saved to ${outputPath}`);

    return report;
  }

  private ensurePathFolderExists(path: string): void {
    const directory = resolve(path, '..');
    mkdirSync(directory, { recursive: true });
  }
}

export function generateRandomScore(): number {
  return Math.floor(Math.random() * 101);
}
