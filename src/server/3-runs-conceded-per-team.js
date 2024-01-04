// Extra runs conceded per team in the year 2016

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
      if (matchesData[i].season === '2016') {
        arrOfId.push(matchesData[i].id);
      }
    }

    fs.createReadStream(csvFilePathDeliveries)
      .pipe(csv())
      .on('data', (row) => {
        deliveriesData.push(row);
      })
      .on('end', () => {
        const extraRunConceded = {};

        for (let i = 0; i < deliveriesData.length; i++) {
          const delivery = deliveriesData[i];
          const matchId = delivery.match_id;
          const battingTeam = delivery.batting_team;
          const extraRuns = parseInt(delivery.extra_runs, 10);

          // Check if the match is in the year 2016
          if (arrOfId.includes(matchId)) {
            // Initialize the team in the extraRunConceded object if not present
            if (!extraRunConceded[battingTeam]) {
              extraRunConceded[battingTeam] = extraRuns;
            }
            else{
                // Increment the extra runs conceded by the team
            extraRunConceded[battingTeam] += extraRuns;
            }
          
          }
        }

        // Save the result in a JSON file
        const outputPath = '../public/output/extraRunsConcededPerTeam2016.json';
        fs.writeFileSync(outputPath, JSON.stringify(extraRunConceded, null, 2));
        console.log(extraRunConceded);

        console.log('Output saved to', outputPath);
      });

  });
