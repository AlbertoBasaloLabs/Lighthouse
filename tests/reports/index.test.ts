import * as reports from '../../src/reports/index.ts';
/**
 * generate random score should return a value between 0 and 100
 */
describe('generateRandomScore', () => {
  it('should return a value between 0 and 100', () => {
    const score = reports.generateRandomScore();
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
