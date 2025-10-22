# Lighthouse Report Generator

A CLI tool to read, process, and save lighthouse reports from a JSON file containing URLs. Each URL
entry will track the date last visited and three main Lighthouse scores (Performance, Accessibility,
Best Practices).

```bash
npm i puppeteer lighthouse
```

## Usage

Imports

```typescript
import type { Result } from 'lighthouse';
import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';
```

Launch browser and lighthouse

```typescript
let browser: puppeteer.Browser | null = null;
browser = await puppeteer.launch({
  headless: true,
  args: ['--remote-debugging-port=9222  '],
});
const lh = await lighthouse(url, {
  port: 9222,
  output: 'json',
  formFactor: 'desktop',
  disableFullPageScreenshot: true,
  screenEmulation,
});
await browser.close();
```

Check for report and scores

```typescript
if (!lh || !lh.lhr) {
  throw new Error('Lighthouse report is undefined');
}
const categoryScore = lh.lhr.categories['performance']?.score ?? 0; // Example for performance score
```
