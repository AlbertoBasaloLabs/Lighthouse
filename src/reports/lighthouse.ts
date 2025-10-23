import type { Result } from 'lighthouse';
import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';

export type CategoryName = 'performance' | 'accessibility' | 'seo' | 'best-practices';

type ScreenEmulation = {
  mobile: boolean;
  width: number;
  height: number;
  deviceScaleFactor: number;
  disabled: boolean;
};

const DEFAULT_SCREEN_EMULATION: ScreenEmulation = {
  mobile: false,
  width: 1920,
  height: 1080,
  deviceScaleFactor: 1,
  disabled: false,
};

const DEFAULT_PORT: number = 9222;

/**
 * Client for running Lighthouse audits with managed Chrome instance.
 */
export class LighthouseClient {
  private browser: puppeteer.Browser | null = null;
  private readonly port: number;
  private readonly screenEmulation: ScreenEmulation;

  constructor(
    port: number = DEFAULT_PORT,
    screenEmulation: ScreenEmulation = DEFAULT_SCREEN_EMULATION,
  ) {
    this.port = port;
    this.screenEmulation = screenEmulation;
  }

  /**
   * Start Chrome browser instance.
   */
  public async start(): Promise<void> {
    if (this.browser !== null) {
      return;
    }

    this.browser = await puppeteer.launch({
      headless: true,
      args: [`--remote-debugging-port=${this.port}`],
    });
  }

  /**
   * Stop Chrome browser instance.
   */
  public async stop(): Promise<void> {
    if (this.browser === null) {
      return;
    }

    try {
      await this.browser.close();
    } finally {
      this.browser = null;
    }
  }

  /**
   * Run Lighthouse audit for a URL.
   * @param url The URL to audit
   * @returns The Lighthouse report
   */
  public async audit(url: string): Promise<Result> {
    const lighthouseResult = await lighthouse(url, {
      port: this.port,
      output: 'json',
      formFactor: 'desktop',
      disableFullPageScreenshot: true,
      screenEmulation: this.screenEmulation,
    });

    if (
      lighthouseResult === null ||
      lighthouseResult === undefined ||
      lighthouseResult.lhr === undefined
    ) {
      throw new Error(`Lighthouse audit failed for ${url}`);
    }

    return lighthouseResult.lhr;
  }

  /**
   * Extract category score from Lighthouse report.
   * @param report The Lighthouse report
   * @param category The category name
   * @returns The score (0-1) or 0 if not found
   */
  public getCategoryScore(report: Result, category: CategoryName): number {
    return report.categories[category]?.score ?? 0;
  }
}
