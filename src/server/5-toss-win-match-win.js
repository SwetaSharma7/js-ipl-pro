//  Find the number of times each team won the toss and also won the match

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
    const wonTossMatch = {};

    for (let i = 0; i < matchesData.length; i++) {
      const match = matchesData[i];
      const tossWinner = match.toss_winner;
      const matchWinner = match.winner;

      if (tossWinner && matchWinner && tossWinner === matchWinner) {
        // The team won both the toss and the match
        if (!wonTossMatch[tossWinner]) {
          wonTossMatch[tossWinner] = 1;
        } else {
          wonTossMatch[tossWinner]++;
        }
      }
    }

    // Output the result
    console.log(wonTossMatch);

    // Save the result in a JSON file
    const outputPath = '../public/output/wonTossAndMatch.json';
    fs.writeFileSync(outputPath, JSON.stringify(wonTossMatch, null, 2));
    console.log('Output saved to', outputPath);
  });
