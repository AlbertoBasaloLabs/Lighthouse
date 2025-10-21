# URL Reports Feature Specification

## Overview

Implement a feature to read, process, and save lighthouse reports from a JSON file containing URLs.
Each URL entry will track the date last visited and three main Lighthouse scores (Performance,
Accessibility, Best Practices).

## Goals

- Read URLs from a JSON file
- Process and validate URL data
- Save processed reports to a JSON file
- No external dependencies required (use Node.js built-ins only)
- No actual Lighthouse integration at this stage (mock data support)

## Feature Description

### 1. Input Format

**File:** `urls.json` (configurable location)

```json
{
  "urls": [
    {
      "url": "https://example.com",
      "name": "Example Site"
    },
    {
      "url": "https://example.org",
      "name": "Example Org"
    }
  ]
}
```

### 2. Processing Requirements

#### 2.1 Read URLs

- Load the JSON file from the file system
- Validate JSON structure
- Extract URL array
- Handle missing or malformed files gracefully

#### 2.2 Process URLs

- For each URL, track:
  - **URL**: The web address being checked
  - **Name**: Friendly identifier (optional)
  - **Date Last Visited**: ISO timestamp of when the URL was last checked
  - **Performance Score**: 0-100 (main Lighthouse metric)
  - **Accessibility Score**: 0-100 (main Lighthouse metric)
  - **Best Practices Score**: 0-100 (main Lighthouse metric)

#### 2.3 Save Report

- Generate a report file with processed data
- File format: JSON
- Include metadata: generation timestamp, processing summary
- Handle file write errors gracefully

### 3. Output Format

**File:** `report.json` (configurable location)

```json
{
  "generatedAt": "2025-10-21T10:30:00Z",
  "totalUrls": 2,
  "urls": [
    {
      "url": "https://example.com",
      "name": "Example Site",
      "dateLastVisited": "2025-10-21T10:30:00Z",
      "scores": {
        "performance": 85,
        "accessibility": 90,
        "bestPractices": 88
      }
    },
    {
      "url": "https://example.org",
      "name": "Example Org",
      "dateLastVisited": "2025-10-21T10:30:00Z",
      "scores": {
        "performance": 75,
        "accessibility": 88,
        "bestPractices": 82
      }
    }
  ]
}
```

### 4. API Design

#### 4.1 Core Functions

**`readUrls(filePath: string): URLEntry[]`**

- Reads JSON file from the given path
- Returns array of URL entries
- Throws error if file not found or invalid JSON
- Returns empty array if urls property is missing

**`processUrls(urls: URLEntry[]): ProcessedReport[]`**

- Takes URL entries and processes them
- Generates or uses mock scores (when no real Lighthouse data)
- Adds dateLastVisited timestamp
- Returns processed report data

**`saveReport(report: ProcessedReport[], outputPath: string): void`**

- Writes processed report to JSON file
- Creates output directory if needed
- Overwrites existing file
- Throws error if write fails

**`generateReport(inputPath: string, outputPath: string): Report`**

- Orchestrates the full workflow
- Calls readUrls → processUrls → saveReport
- Returns complete report object

### 5. Data Structures

```typescript
interface URLEntry {
  url: string;
  name?: string;
}

interface Score {
  performance: number;
  accessibility: number;
  bestPractices: number;
}

interface ProcessedURL {
  url: string;
  name?: string;
  dateLastVisited: string;
  scores: Score;
}

interface Report {
  generatedAt: string;
  totalUrls: number;
  urls: ProcessedURL[];
}
```

### 6. Error Handling

- File not found: Log error and provide helpful message
- Invalid JSON: Parse error message and report it
- Invalid score values: Default to 0 or use fallback values
- File write errors: Throw descriptive error with retry guidance

### 7. Constraints

- **Zero dependencies**: Only use Node.js built-in modules (`fs`, `path`)
- **No Lighthouse integration**: Focus on file I/O and data processing only
- **TypeScript support**: Must be written in TypeScript
- **Testability**: Functions should be pure where possible

### 8. Future Considerations

- Integration with actual Lighthouse API
- Batch processing for multiple URLs
- Historical data tracking and trends
- CLI interface for running reports
- Configuration file support

## Acceptance Criteria

- [ ] Can read URLs from a JSON file
- [ ] Can process URL data and add timestamps
- [ ] Can generate mock or placeholder scores
- [ ] Can save processed report to JSON file
- [ ] No external dependencies used
- [ ] Functions are properly typed with TypeScript
- [ ] Error handling for missing/invalid files
- [ ] Output report includes all required fields
