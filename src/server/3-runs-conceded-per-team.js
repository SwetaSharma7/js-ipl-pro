const fs = require('fs');
const csv = require('csv-parser');

const csvFilePathDeliveries = '../data/deliveries.csv';
const csvFilePathMatches = '../data/matches.csv';
const deliveriesData = [];
const matchesData = [];

// Read matches data and filter matches for the year 2016
fs.createReadStream(csvFilePathMatches)
  .pipe(csv())
  .on('data', (row) => {
    matchesData.push(row);
  })
  .on('end', () => {
    // Extract match IDs for the year 2016
    const arrOfId = matchesData
      .filter((match) => match.season === '2016')
      .map((match) => match.id);

    // Read deliveries data
    fs.createReadStream(csvFilePathDeliveries)
      .pipe(csv())
      .on('data', (row) => {
        deliveriesData.push(row);
      })
      .on('end', () => {
        // Use reduce to accumulate extra runs conceded per team in the year 2016
        const extraRunConceded = deliveriesData.reduce((accumulator, delivery) => {
          const matchId = delivery.match_id;
          const battingTeam = delivery.batting_team;
          const extraRuns = parseInt(delivery.extra_runs, 10);

          // Check if the match is in the year 2016
          if (arrOfId.includes(matchId)) {
            // Initialize the team in the extraRunConceded object if not present
            accumulator[battingTeam] = (accumulator[battingTeam] || 0) + extraRuns;
          }

          return accumulator;
        }, {});

        // Save the result in a JSON file
        const outputPath = '../public/output/extraRunsConcededPerTeam2016.json';
        fs.writeFileSync(outputPath, JSON.stringify(extraRunConceded, null, 2));
        console.log(extraRunConceded);

        console.log('Output saved to', outputPath);
      });
  });
