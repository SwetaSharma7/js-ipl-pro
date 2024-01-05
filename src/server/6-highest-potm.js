//  Find a player who has won the highest number of Player of the Match awards for each season

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
    const playerOfTheMatchBySeason = {};

    for (let i = 0; i < matchesData.length; i++) {
      const match = matchesData[i];
      const season = match.season;
      const playerOfTheMatch = match.player_of_match;

      if (season && playerOfTheMatch) {
        if (!playerOfTheMatchBySeason[season]) {
          playerOfTheMatchBySeason[season] = {};
        }

        if (!playerOfTheMatchBySeason[season][playerOfTheMatch]) {
          playerOfTheMatchBySeason[season][playerOfTheMatch] = 1;
        } else {
          playerOfTheMatchBySeason[season][playerOfTheMatch]++;
        }
      }
    }

    // Find the player with the highest number of Player of the Match awards for each season
    const highestScorersBySeason = {};
    for (const season in playerOfTheMatchBySeason) {
      const players = playerOfTheMatchBySeason[season];
      const maxPlayer = Object.keys(players).reduce((a, b) => players[a] > players[b] ? a : b);
      highestScorersBySeason[season] = { player: maxPlayer, awards: players[maxPlayer] };
    }

    // Output the result
    console.log(highestScorersBySeason);

    // Save the result in a JSON file
    const outputPath = '../public/output/highestPlayerOfTheMatchBySeason.json';
    fs.writeFileSync(outputPath, JSON.stringify(highestScorersBySeason, null, 2));
    console.log('Output saved to', outputPath);
  });
