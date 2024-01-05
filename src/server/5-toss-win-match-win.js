//  Find the number of times each team won the toss and also won the match

const fs = require('fs');
const csv = require('csv-parser');

const csvFilePathMatches = '../data/matches.csv';
const matchesData = [];

// Read CSV file and populate matchesData
fs.createReadStream(csvFilePathMatches)
  .pipe(csv())
  .on('data', (row) => {
    matchesData.push(row);
  })
  .on('end', () => {
    const wonTossMatch = {};

    // Count the number of times each team won the toss and the match
    matchesData.forEach((match) => {
      const { toss_winner, winner } = match;

      if (toss_winner && winner && toss_winner === winner) {
        wonTossMatch[toss_winner] = (wonTossMatch[toss_winner] || 0) + 1;
      }
    });

    // Output the result
    console.log(wonTossMatch);

    // Save the result in a JSON file
    const outputPath = '../public/output/wonTossAndMatch.json';
    fs.writeFileSync(outputPath, JSON.stringify(wonTossMatch, null, 2));
    console.log('Output saved to', outputPath);
  });
