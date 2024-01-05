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
    // Initialize a data structure to store strike rates by season and batsman
    const strikeRatesBySeason = deliveriesData
      .filter((delivery) => delivery.wide_runs === '0') // Exclude wide deliveries
      .reduce((acc, delivery) => {
        const { batsman, season, total_runs: totalRuns } = delivery;

        // Initialize the season and batsman if not present
        acc[season] = acc[season] || {};
        acc[season][batsman] = acc[season][batsman] || { runs: 0, balls: 0 };

        // Update the runs and balls for the batsman in the season
        acc[season][batsman].runs += parseInt(totalRuns, 10);
        acc[season][batsman].balls++;

        return acc;
      }, {});

    // Calculate the strike rate for each batsman in each season
    for (const season in strikeRatesBySeason) {
      for (const batsman in strikeRatesBySeason[season]) {
        const { runs, balls } = strikeRatesBySeason[season][batsman];
        const strikeRate = balls !== 0 ? (runs / balls) * 100 : 0;

        // Update the strike rate in the data structure
        strikeRatesBySeason[season][batsman].strikeRate = strikeRate;
      }
    }

    // Output the results
    console.log(strikeRatesBySeason);

    // Save the result in a JSON file
    const outputPath = '../public/output/strikeRatesBySeason.json';
    fs.writeFileSync(outputPath, JSON.stringify(strikeRatesBySeason, null, 2));
    console.log('Output saved to', outputPath);
  });
