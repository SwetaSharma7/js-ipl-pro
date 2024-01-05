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
        // Your logic to find the bowler with the best economy in super overs
        const superOverDeliveries = deliveriesData.filter((delivery) => {
          const matchId = delivery.match_id;
          const isSuperOver = matchesData.some((match) => match.id === matchId && match.is_super_over === '1');
          return isSuperOver;
        });

        const bowlerStats = {};

        for (let i = 0; i < superOverDeliveries.length; i++) {
          const delivery = superOverDeliveries[i];
          const bowler = delivery.bowler;
          const totalRuns = parseInt(delivery.total_runs);
          const extras = parseInt(delivery.extra_runs);

          if (bowlerStats[bowler]) {
            bowlerStats[bowler].runs += totalRuns;
            bowlerStats[bowler].balls++;
          } else {
            bowlerStats[bowler] = { runs: totalRuns, balls: 1 };
          }
        }

        // Calculate economy rate for each bowler
        for (const bowler in bowlerStats) {
          const { runs, balls } = bowlerStats[bowler];
          const economyRate = (runs / balls) * 6; // Runs per over

          bowlerStats[bowler].economyRate = economyRate.toFixed(2);
        }

        // Find the bowler with the best economy in super overs
        let bestEconomyBowler;
        let minEconomyRate = Infinity;

        for (const bowler in bowlerStats) {
          if (bowlerStats[bowler].economyRate < minEconomyRate) {
            minEconomyRate = bowlerStats[bowler].economyRate;
            bestEconomyBowler = bowler;
          }
        }

        console.log(`The bowler with the best economy rate in super overs is ${bestEconomyBowler} with an economy rate of ${minEconomyRate}.`);
      });
  });
