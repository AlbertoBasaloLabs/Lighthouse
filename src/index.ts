import * as reports from './reports/index.ts';

function main() {
  console.log('Lighthouse Automation Tool');
  reports.generateReport('data/urls.json');
}

main();

// Additional exports can be added here if needed
export * from './reports/index.ts';
