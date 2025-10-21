# URL Reports Implementation Plan

## Overview

This document outlines the step-by-step implementation plan for the URL Reports feature based on the
specification in `url-reports.spec.md`.

Simplified approach: single file module with basic error handling, no tests at this stage.

## Implementation Phases

### Phase 1: Type Definitions

**Objective:** Define TypeScript interfaces for type safety.

#### Task 1.1: Create types

- [ ] Create `src/reports/types.ts`
- [ ] Define `URLEntry` interface
- [ ] Define `Score` interface
- [ ] Define `ProcessedURL` interface
- [ ] Define `Report` interface
- [ ] Add JSDoc comments

**Deliverable:** `src/reports/types.ts` with all interfaces

---

### Phase 2: Reports Module

**Objective:** Single module handling all file I/O and processing logic.

#### Task 2.1: Create unified module

- [ ] Create `src/reports/index.ts`
- [ ] Implement `readUrls(filePath: string): URLEntry[]` function
  - Read JSON file using `fs.readFileSync()`
  - Parse JSON
  - Extract `urls` array property
  - Return empty array if missing
- [ ] Implement `processUrls(urls: URLEntry[]): ProcessedURL[]` function
  - Generate ISO timestamp for each URL
  - Generate random mock scores (0-100)
  - Preserve URL and name
  - Return processed array
- [ ] Implement `generateReport(inputPath: string, outputPath: string): Report` function
  - Call readUrls
  - Call processUrls
  - Write result to outputPath as JSON
  - Return report with metadata (generatedAt, totalUrls)

#### Task 2.2: Error Handling

- [ ] Wrap file operations in try-catch blocks
- [ ] Log errors to console
- [ ] Let errors propagate (simple approach)
- [ ] Handle missing `urls` property gracefully

#### Task 2.3: Export API

- [ ] Export `generateReport` function
- [ ] Export `readUrls` function (for advanced usage)
- [ ] Export `processUrls` function (for advanced usage)
- [ ] Export all types from index

**Deliverable:** `src/reports/index.ts` with complete working module

---

### Phase 3: Integration

**Objective:** Make module available from main entry point.

#### Task 3.1: Main entry point

- [ ] Update `src/index.ts` to export reports module
- [ ] Verify imports work correctly

**Deliverable:** Exported reports module from main package

---

## Implementation Order

1. **Phase 1** - Create types (5 min)
2. **Phase 2** - Create reports module (30 min)
3. **Phase 3** - Integrate to main entry (5 min)

## Success Criteria

- [ ] Can read URLs from a JSON file
- [ ] Can process URL data and add timestamps
- [ ] Can generate mock scores
- [ ] Can save processed report to JSON file
- [ ] No external dependencies used
- [ ] Functions are properly typed with TypeScript
- [ ] Basic error handling in place
- [ ] Output report includes all required fields

## Estimated Effort

**Total Time:** ~40 minutes

## Notes

- Single file for all file operations (reader, processor, writer)
- Simple error handling with try-catch and console logs
- No testing or complex validation
- Uses only Node.js built-in modules (`fs`, `path`)
- TypeScript throughout
- No external dependencies
