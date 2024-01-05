//  Find the strike rate of a batsman for each season


const fs = require('fs');
const csv = require('csv-parser');

const csvFilePathDeliveries = '../data/deliveries.csv';
const deliveriesData = [];

fs.createReadStream(csvFilePathDeliveries)
  .pipe(csv())
  .on('data', (row) => {
    deliveriesData.push(row);
  })
  .on('end', () => {
    const strikeRatesBySeason = {};

    // Process each delivery
    for (let i = 0; i < deliveriesData.length; i++) {
      const delivery = deliveriesData[i];
      const batsman = delivery.batsman;
      const season = delivery.season;
      const totalRuns = parseInt(delivery.total_runs, 10);
      const isWide = delivery.wide_runs !== '0';

      // Skip wide deliveries
      if (!isWide) {
        // Initialize the season and batsman if not present
        if (!strikeRatesBySeason[season]) {
          strikeRatesBySeason[season] = {};
        }
        if (!strikeRatesBySeason[season][batsman]) {
          strikeRatesBySeason[season][batsman] = { runs: 0, balls: 0 };
        }

        // Update the runs and balls for the batsman in the season
        strikeRatesBySeason[season][batsman].runs += totalRuns;
        strikeRatesBySeason[season][batsman].balls++;
      }
    }

    // Calculate the strike rate for each batsman in each season
    for (const season in strikeRatesBySeason) {
      for (const batsman in strikeRatesBySeason[season]) {
        const runs = strikeRatesBySeason[season][batsman].runs;
        const balls = strikeRatesBySeason[season][batsman].balls;
        
        // Avoid division by zero
        const strikeRate = balls !== 0 ? (runs / balls) * 100 : 0;

        // Update the strike rate in the data structure
        strikeRatesBySeason[season][batsman].strikeRate = strikeRate;
      }
    }

    // Output or save the results
    console.log(strikeRatesBySeason);

    // Save the result in a JSON file
    const outputPath = '../public/output/strikeRatesBySeason.json';
    fs.writeFileSync(outputPath, JSON.stringify(strikeRatesBySeason, null, 2));
    console.log('Output saved to', outputPath);
  });
         