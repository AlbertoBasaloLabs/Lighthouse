import type { Result } from 'lighthouse';
import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';

export type CategoryName = 'performance' | 'accessibility' | 'seo' | 'best-practices';

const screenEmulation = {
  mobile: false,
  width: 1920,
  height: 1080,
  deviceScaleFactor: 1,
  disabled: false,
};

// We keep an internal browser reference so callers can start/stop a single
// Chrome instance and pass its debugging port to multiple lighthouse runs.
let chromeProcess: puppeteer.Browser | null = null;
let chromeDebugPort = 0;

export async function startChrome(port = 9222): Promise<number> {
  if (chromeProcess) {
    return chromeDebugPort || port;
  }
  chromeProcess = await puppeteer.launch({
    headless: true,
    args: [`--remote-debugging-port=${port}`],
  });
  chromeDebugPort = port;
  return chromeDebugPort;
}

export async function stopChrome(): Promise<void> {
  if (!chromeProcess) return;
  try {
    await chromeProcess.close();
  } finally {
    chromeProcess = null;
    chromeDebugPort = 0;
  }
}

/**
 * Get a Lighthouse report for the provided URL.
 * If a port is provided, Lighthouse will connect to that existing Chrome instance.
 * If no port is provided, this function will launch a short-lived Chrome instance
 * for the single run (backwards-compatible behavior).
 */
export async function getLighthouseReport(url: string, port?: number): Promise<Result> {
  let ownChrome: puppeteer.Browser | null = null;
  const usedPort: number = (port ?? chromeDebugPort) || 9222;

  try {
    if (!port && !chromeProcess) {
      // launch a short-lived chrome instance when caller didn't start one
      ownChrome = await puppeteer.launch({
        headless: true,
        args: [`--remote-debugging-port=${usedPort}`],
      });
      // if ownChrome launched, set usedPort explicitly
    }

    const lh = await lighthouse(url, {
      port: usedPort,
      output: 'json',
      formFactor: 'desktop',
      disableFullPageScreenshot: true,
      screenEmulation,
    });

    if (!lh || !lh.lhr) {
      throw new Error('Lighthouse report is undefined');
    }

    return lh.lhr;
  } finally {
    if (ownChrome) {
      try {
        await ownChrome.close();
      } catch {
        // ignore
      }
    }
  }
}

export function getLighthouseCategoryScore(lhr: Result, category: CategoryName): number {
  return lhr.categories[category]?.score ?? 0;
}
