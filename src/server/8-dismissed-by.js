// Find the highest number of times one player has been dismissed by another player

const fs = require('fs');
const csv = require('csv-parser');

const csvFilePathDeliveries = '../data/deliveries.csv';
const csvFilePathMatches = '../data/matches.csv';
const deliveriesData = [];
const matchesData = [];

// Read matches data
fs.createReadStream(csvFilePathMatches)
  .pipe(csv())
  .on('data', (row) => {
    matchesData.push(row);
  })
  .on('end', () => {
    // Read deliveries data
    fs.createReadStream(csvFilePathDeliveries)
      .pipe(csv())
      .on('data', (row) => {
        deliveriesData.push(row);
      })
      .on('end', () => {
        // logic to find the highest number of times one player has been dismissed by another player
        const dismissedCounts = {};

        for (let i = 0; i < deliveriesData.length; i++) {
          const delivery = deliveriesData[i];
          const dismissalType = delivery.dismissal_kind;
          const dismissedPlayer = delivery.player_dismissed;
          const bowler = delivery.bowler;

          if (dismissalType !== 'run out' && dismissedPlayer && bowler) {
            const key = `${dismissedPlayer}-${bowler}`;

            if (dismissedCounts[key]) {
              dismissedCounts[key]++;
            } else {
              dismissedCounts[key] = 1;
            }
          }
        }

        // Find the highest dismissal count
        let maxDismissals = 0;
        let maxDismissedPair;

        for (const key in dismissedCounts) {
          if (dismissedCounts[key] > maxDismissals) {
            maxDismissals = dismissedCounts[key];
            maxDismissedPair = key;
          }
        }

        console.log(`The highest number of times one player has been dismissed by another player is ${maxDismissals} times.`);
        console.log(`Player dismissed: ${maxDismissedPair.split('-')[0]}, Bowler: ${maxDismissedPair.split('-')[1]}`);
      });
  });
