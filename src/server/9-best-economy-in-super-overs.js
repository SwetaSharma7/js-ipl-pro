const fs = require('fs');
const csv = require('csv-parser');

const deliveriesFilePath = '../data/deliveries.csv';

// Function to extract data and calculate best economy bowler in super over
const extractDataAndCalculateBestEconomy = () => {
  const deliveriesData = [];

  // Reading the deliveries CSV data file using fs and csv-parser
  fs.createReadStream(deliveriesFilePath)
    .pipe(csv())
    .on('data', (data) => {
      deliveriesData.push(data);
    })
    .on('end', () => {
      try {
        let newObject = {};

        // Iterating through deliveries data and checking for super overs
        for (let object of deliveriesData) {
          let isSuperOver = object.is_super_over;
          let bowler = object.bowler;
          let totalRuns = object.total_runs;

          // If super over is true, storing the result in newObject
          if (isSuperOver == 1) {
            if (newObject.hasOwnProperty(bowler)) {
              newObject[bowler].runs += parseInt(totalRuns);
              newObject[bowler].balls += 1;
            } else {
              newObject[bowler] = {
                runs: parseInt(totalRuns),
                balls: 1,
              };
            }
          }
        }

        // Calculating the economy rate
        for (let key in newObject) {
          newObject[key].economy = newObject[key].runs / (newObject[key].balls / 6);
        }

        let keysArray = Object.keys(newObject);

        // Sorting the bowlers based on economy rate
        let sortedKeys = keysArray.sort(function (key1, key2) {
          return newObject[key1].economy - newObject[key2].economy;
        });

        let finalOutput = [sortedKeys[0], newObject[sortedKeys[0]]];
        console.log(finalOutput);

        // Dumping the result to the output folder
        
        const dumpPath = '../public/output/bestEconomyInSuperOver.json';
        fs.writeFile(dumpPath, JSON.stringify(finalOutput), () => {});
      } catch (error) {
        console.log(error);
      }
    });
};

// Calling the function to extract data and calculate best economy bowler
extractDataAndCalculateBestEconomy();
