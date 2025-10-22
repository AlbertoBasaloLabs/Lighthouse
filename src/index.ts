import * as reports from './reports/index.js';

function main() {
  console.log('Lighthouse Report Generator');
  reports.generateReport('data/urls.json');
}

main();
