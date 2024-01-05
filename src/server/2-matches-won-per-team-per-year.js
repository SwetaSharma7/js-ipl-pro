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
    // Use reduce to process each match in matchesData and accumulate results
    const matchesWonPerTeam = matchesData.reduce((accumulator, match) => {
      const year = match.season;
      const winner = match.winner;

      // Initialize the year in the matchesWonPerTeam object if not present
      if (!accumulator[year]) {
        accumulator[year] = {};
      }

      // Increment the count for the winning team in that year
      accumulator[year][winner] = (accumulator[year][winner] || 0) + 1;

      return accumulator;
    }, {});

    // Save the result in a JSON file
    const outputPath = '../public/output/matchesWonPerTeam.json';
    fs.writeFileSync(outputPath, JSON.stringify(matchesWonPerTeam, null, 2));
    console.log(matchesWonPerTeam);

    console.log('Output saved to', outputPath);
  });
