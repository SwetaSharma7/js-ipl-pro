// Number of matches played per year for all the years in IPL.

//import file system module for file operations
const fs =require('fs');

//import the csv-parser module for CSV parsing
const csv = require('csv-parser');
const { stringify } = require('querystring');


const csvFilePathMatches='../data/matches.csv';

//empty arr to store parsed csv data from matches.csv
const matchesData=[];

// Create a readable stream for the matches
fs.createReadStream(csvFilePathMatches)
.pipe(csv())
.on('data',(row) => {
    matchesData.push(row);
})
.on('end', () =>{
    const matchesPerYear={};

// here I am using the loop to get desired output
    for(let index=0;index<matchesData.length;index++){
        const year=matchesData[index].season;

        if(!matchesPerYear[year]){
            matchesPerYear[year]=1;
        }
        else{
            matchesPerYear[year]++;
        }
    }
    console.log(matchesPerYear);

    // here I am storing output in .json file which is in public output.
    const outputPath='../public/output/matchesPerYear.json';
    fs.writeFileSync(outputPath, JSON.stringify(matchesPerYear, null, 2));
});
