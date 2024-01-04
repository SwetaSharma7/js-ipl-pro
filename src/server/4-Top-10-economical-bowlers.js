// que: Top 10 economical bowlers in the year 2015


const fs = require('fs');
const csv = require('csv-parser');

const csvFilePathDeliveries = '../data/deliveries.csv';
const csvFilePathMatches = '../data/matches.csv';
const deliveriesData = [];
const matchesData = [];

fs.createReadStream(csvFilePathMatches)
  .pipe(csv())
  .on('data', (row) => {
    matchesData.push(row);
  })
  .on('end', () => {
    const arrOfId = [];

    for (let i = 0; i < matchesData.length; i++) {
      if (matchesData[i].season === '2015') {
        arrOfId.push(matchesData[i].id);
      }
    }

    fs.createReadStream(csvFilePathDeliveries)
      .pipe(csv())
      .on('data', (row) => {
        deliveriesData.push(row);
      })
      .on('end', () => {
        const bowlerEconomies = {};

        for (let i = 0; i < deliveriesData.length; i++) {
          const delivery = deliveriesData[i];
          const matchId = delivery.match_id;
          const bowler = delivery.bowler;
          const totalRuns = parseInt(delivery.total_runs, 10);
          const isExtra = delivery.extra_runs !== '0';

          if (arrOfId.includes(matchId) && !isExtra) {
            if (!bowlerEconomies[bowler]) {
              bowlerEconomies[bowler] = { runs: 0, balls: 0 };
            }

            bowlerEconomies[bowler].runs += totalRuns;
            bowlerEconomies[bowler].balls++;
          }
        }

        const top10EconomicalBowlers = [];
        for (const bowler in bowlerEconomies) {
          const runs = bowlerEconomies[bowler].runs;
          const balls = bowlerEconomies[bowler].balls;
          bowlerEconomies[bowler].economy = balls !== 0 ? (runs / balls) * 6 : 0;

          top10EconomicalBowlers.push(bowler);
        }

        // Sort the bowlers based on economy rate
        top10EconomicalBowlers.sort((a, b) => bowlerEconomies[a].economy - bowlerEconomies[b].economy);

        // Get the top 10 bowlers
        const top10 = top10EconomicalBowlers.slice(0, 10);

        // Save the result in a JSON file
        const outputPath = '../public/output/top10EconomicalBowlers2015.json';
        fs.writeFileSync(outputPath, JSON.stringify(top10, null, 2));
        console.log(top10);

        console.log('Output saved to', outputPath);
      });
  });

