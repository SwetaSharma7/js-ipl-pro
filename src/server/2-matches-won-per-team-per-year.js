const fs = require('fs');
const csv = require('csv-parser');

const csvFilePathMatches = '../data/matches.csv';
const matchesData = [];

fs.createReadStream(csvFilePathMatches)
  .pipe(csv())
  .on('data', (row) => {
    matchesData.push(row);
  })
  .on('end', () => {
    const matchesWonPerTeam = {};

    // Process each match in matchesData
    for (let i = 0; i < matchesData.length; i++) {
      const match = matchesData[i];
      const year = match.season;
      const winner = match.winner;

      // Initialize the year in the matchesWonPerTeam object if not present
      if (!matchesWonPerTeam[year]) {
        matchesWonPerTeam[year] = {};
      }

      // Increment the count for the winning team in that year
      if (!matchesWonPerTeam[year][winner]) {
        matchesWonPerTeam[year][winner] = 1;
      } else {
        matchesWonPerTeam[year][winner]++;
      }
    }

    // Save the result in a JSON file
    const outputPath = '../public/output/matchesWonPerTeam.json';
    fs.writeFileSync(outputPath, JSON.stringify(matchesWonPerTeam, null, 2));
    console.log(matchesWonPerTeam);

    console.log('Output saved to', outputPath);
  });
