const fs = require('fs');
const csv = require('csv-parser');

const csvFilePathDeliveries = '../data/deliveries.csv';
const csvFilePathMatches = '../data/matches.csv';

// Function to read CSV file and return data
const readCSVFile = (filePath, onData) => {
  return new Promise((resolve) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => onData(data, row))
      .on('end', () => resolve(data));
  });
};

// Function to filter matches for the year 2015
const filterMatchesForYear = (matchesData) => {
  return matchesData
    .filter(match => match.season === '2015')
    .map(match => match.id);
};

// Function to calculate bowler economies
const calculateBowlerEconomies = (arrOfId, deliveriesData) => {
  const bowlerEconomies = {};

  deliveriesData.forEach((delivery) => {
    const { match_id, bowler, total_runs, extra_runs } = delivery;
    const isExtra = extra_runs !== '0';

    if (arrOfId.includes(match_id) && !isExtra) {
      bowlerEconomies[bowler] = bowlerEconomies[bowler] || { runs: 0, balls: 0 };

      bowlerEconomies[bowler].runs += parseInt(total_runs, 10);
      bowlerEconomies[bowler].balls++;
    }
  });

  return bowlerEconomies;
};

// Function to calculate economy and get top 10 bowlers
const calculateAndSortEconomy = (bowlerEconomies) => {
  return Object.keys(bowlerEconomies)
    .sort((a, b) => bowlerEconomies[a].economy - bowlerEconomies[b].economy)
    .slice(0, 10);
};

// Function to save result to a JSON file
const saveResultToFile = (top10) => {
  const outputPath = '../public/output/top10EconomicalBowlers2015.json';
  fs.writeFileSync(outputPath, JSON.stringify(top10, null, 2));
  console.log(top10);

  console.log('Output saved to', outputPath);
};

// Main function
const main = async () => {
  const matchesData = await readCSVFile(csvFilePathMatches, (data, row) => data.push(row));
  const arrOfId = filterMatchesForYear(matchesData);

  const deliveriesData = await readCSVFile(csvFilePathDeliveries, (data, row) => data.push(row));
  const bowlerEconomies = calculateBowlerEconomies(arrOfId, deliveriesData);

  for (const bowler in bowlerEconomies) {
    const { runs, balls } = bowlerEconomies[bowler];
    bowlerEconomies[bowler].economy = balls !== 0 ? (runs / balls) * 6 : 0;
  }

  const top10 = calculateAndSortEconomy(bowlerEconomies);
  saveResultToFile(top10);
};

// Run the main function
main();
