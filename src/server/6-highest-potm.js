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
    const playerOfTheMatchBySeason = matchesData.reduce((acc, match) => {
      const { season, player_of_match } = match;

      if (season && player_of_match) {
        acc[season] = acc[season] || {};

        acc[season][player_of_match] = (acc[season][player_of_match] || 0) + 1;
      }

      return acc;
    }, {});

    const highestScorersBySeason = Object.entries(playerOfTheMatchBySeason).reduce(
      (acc, [season, players]) => {
        const [maxPlayer, awards] = Object.entries(players).reduce(
          ([a, b], [c, d]) => (d > b ? [c, d] : [a, b]),
          ['', 0]
        );

        acc[season] = { player: maxPlayer, awards };
        return acc;
      },
      {}
    );

    console.log(highestScorersBySeason);

    const outputPath = '../public/output/highestPlayerOfTheMatchBySeason.json';
    fs.writeFileSync(outputPath, JSON.stringify(highestScorersBySeason, null, 2));
    console.log('Output saved to', outputPath);
  });
