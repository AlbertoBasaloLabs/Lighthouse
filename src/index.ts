import * as reports from './reports/index.js';

function main() {
  console.log('Lighthouse Automation Tool');
  reports.generateReport('data/urls.json');
}

main();
