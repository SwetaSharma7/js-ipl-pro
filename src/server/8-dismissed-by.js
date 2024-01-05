const fs = require('fs');
const csv = require('csv-parser');

const csvFilePathDeliveries = '../data/deliveries.csv';
const csvFilePathMatches = '../data/matches.csv';
const deliveriesData = [];
const matchesData = [];

// Read matches data
fs.createReadStream(csvFilePathMatches)
  .pipe(csv())
  .on('data', (row) => matchesData.push(row))
  .on('end', () => {
    // Read deliveries data
    fs.createReadStream(csvFilePathDeliveries)
      .pipe(csv())
      .on('data', (row) => deliveriesData.push(row))
      .on('end', () => {
        // Logic to find the highest number of times one player has been dismissed by another player
        const dismissedCounts = deliveriesData.reduce((acc, delivery) => {
          const dismissalType = delivery.dismissal_kind;
          const dismissedPlayer = delivery.player_dismissed;
          const bowler = delivery.bowler;

          if (dismissalType !== 'run out' && dismissedPlayer && bowler) {
            const key = `${dismissedPlayer}-${bowler}`;
            acc[key] = (acc[key] || 0) + 1;
          }

          return acc;
        }, {});

        // Find the highest dismissal count
        const [maxDismissedPair, maxDismissals] = Object.entries(dismissedCounts).reduce(
          ([maxPair, maxCount], [key, count]) => (count > maxCount ? [key, count] : [maxPair, maxCount]),
          ['', 0]
        );

        // Output the result
        // Output the result
        const outputPath = '../public/output/dismissedByOther.json';  
        fs.writeFileSync(outputPath, JSON.stringify(dismissedCounts, null, 2));

        console.log(`The highest number of times one player has been dismissed by another player is ${maxDismissals} times.`);
        console.log(`Player dismissed: ${maxDismissedPair.split('-')[0]}, Bowler: ${maxDismissedPair.split('-')[1]}`);

      });
  });
