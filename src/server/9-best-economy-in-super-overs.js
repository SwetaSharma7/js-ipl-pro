const fs = require('fs');
const csv = require('csv-parser');

const deliveriesFilePath = '../data/deliveries.csv';
const deliveriesData = [];

// Reading the deliveries CSV data file 
fs.createReadStream(deliveriesFilePath)
  .pipe(csv())
  .on('data', (data) => {
    deliveriesData.push(data);
  })
  .on('end', () => {
    // calculate the best economy bowler
    try {
      let newObject = {};

      // Iterating through deliveries data and checking for super overs
      deliveriesData
        .filter((object) => object.is_super_over == 1)
        .forEach((object) => {
          let bowler = object.bowler;
          let totalRuns = parseInt(object.total_runs);

          // If super over is true, storing the result in newObject
          if (newObject.hasOwnProperty(bowler)) {
            newObject[bowler].runs += totalRuns;
            newObject[bowler].balls += 1;
          } else {
            newObject[bowler] = {
              runs: totalRuns,
              balls: 1,
            };
          }
        });

      // Calculating the economy rate
      for (let key in newObject) {
        newObject[key].economy = newObject[key].runs / (newObject[key].balls / 6);
      }

      let keysArray = Object.keys(newObject);

      // Sorting the bowlers based on economy rate
      let sortedKeys = keysArray.sort((key1, key2) => newObject[key1].economy - newObject[key2].economy);

      let finalOutput = [sortedKeys[0], newObject[sortedKeys[0]]];
      console.log(finalOutput);

      // Dumping the result to the output folder
      const outputPath = '../public/output/bestEconomyInSuperOver.json';
      fs.writeFile(outputPath, JSON.stringify(finalOutput), () => {});
    } catch (error) {
      console.log(error);
    }
  });
