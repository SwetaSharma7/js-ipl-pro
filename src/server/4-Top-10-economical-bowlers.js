const fs=require('fs');
const csv=require('csv-parser');

const csvFilePathMatches='../data/matches.csv';
const csvFilePathDeliveries='../data/deliveries.csv';

const matchesData=[];
const deliveriesData=[];

fs.createReadStream(csvFilePathMatches)
.pipe(csv())
.on('data',(row) =>{
     matchesData.push(row);
})
.on('end', () => {
    let arrayOfIds=matchesData.filter(match => {
        return match.season=="2015";
    })
    .map(element => {
        return element.id;
    })

    // console.log(arrayOfIds);
    // console.log(deliveriesData);mb

    fs.createReadStream(csvFilePathDeliveries)
    .pipe(csv())
    .on('data', (row) =>{
        deliveriesData.push(row);
    })
    .on('end', () =>{
        // console.log(deliveriesData);
        let deliveriesArrayOdIds=deliveriesData.filter(element => {
            if(arrayOfIds.includes(element.match_id)){
                return element.match_id;
            }
        });

        let obj=deliveriesArrayOdIds.reduce(function(acc,curr){
                  if(acc[curr.bowler]){
                    acc[curr.bowler].run+=parseInt(curr.total_runs),
                    acc[curr.bowler].balls+=1;
                  }
                  else{
                    acc[curr.bowler]={
                        run : parseFloat(curr.total_runs),
                        balls :1
                    }
                  }

                  return acc;
        },{});

        let arrayOfObjects=Object.entries(obj);

        let economyOfBowlers=arrayOfObjects.reduce(function(acc,curr) {
            let runs=curr[1].run;
            let balls=curr[1].balls;

            let economy=(runs/balls)*6;
            acc[curr[0]]=economy;

            return acc;
        },{})

    //  console.log(economyOfBowlers);

     let sortedBowlers=Object.keys(economyOfBowlers);
     sortedBowlers=sortedBowlers.sort((a,b) =>{
        
            return economyOfBowlers[a]-economyOfBowlers[b];
     });

        // console.log(sortedBowlers);
   

       const top10Bowlers=sortedBowlers.slice(0,10);
       console.log(top10Bowlers);

        const ouputPath='../public/output/top10bowlersin2015.json';
        fs.writeFileSync(ouputPath,JSON.stringify(top10Bowlers,null, 2))
    });
});