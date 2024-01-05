const fs = require('fs');
const csv = require('csv-parser');

const csvFilePathMatches = '../data/matches.csv';
const matchesData = [];

// Create a readable stream for the matches
fs.createReadStream(csvFilePathMatches)
  .pipe(csv())
  .on('data', (row) => {
    // Push each row of data into the matchesData array
    matchesData.push(row);
  })
  .on('end', () => {
    const matchesPerYear = {};

    // Use forEach to iterate over each matchData entry
    matchesData.forEach((match) => {
      const year = match.season;

      // Increment the count for the corresponding year in matchesPerYear
      matchesPerYear[year] = (matchesPerYear[year] || 0) + 1;
    });

    console.log(matchesPerYear);

    // Write the result to a JSON file
    const outputPath = '../public/output/matchesPerYear.json';
    fs.writeFileSync(outputPath, JSON.stringify(matchesPerYear, null, 2));
  });
