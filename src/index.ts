import { LighthouseClient, ReportGenerator } from './reports/index.js';

async function main(): Promise<void> {
  console.clear();
  console.log('💡 Lighthouse Report Generator');

  const lighthouseClient: LighthouseClient = new LighthouseClient();
  const reportGenerator: ReportGenerator = new ReportGenerator(lighthouseClient);

  await reportGenerator.generateReport('data/urls.json');
}

main();
