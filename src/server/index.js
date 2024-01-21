const express = require('express');
const path = require('path');
const cors = require("cors")
const fs = require('fs');


const webApp = express();
webApp.use(cors());
const port = 3000;

// making static server.
webApp.use(express.static(path.join(__dirname, "../public")));

webApp.get("/bestEconomyInSuperOver", (req, res) => {
    const filePath = path.join(__dirname, "../public/output/bestEconomyInSuperOver.json");
    res.sendFile(filePath);
});

webApp.get("/dismissedByOther", (req, res) => {
    const filePath = path.join(__dirname, "../public/output/dismissedByOther.json");
    res.sendFile(filePath);
});

webApp.get("/extraRunsConcededPerTeam2016", (req, res) => {
    const filePath = path.join(__dirname, "../public/output/extraRunsConcededPerTeam2016.json");
    res.sendFile(filePath);
})

webApp.get("/highestPlayerOfTheMatchBySeason", (req, res) => {
    const filePath = path.join(__dirname, "../public/output/highestPlayerOfTheMatchBySeason.json");
    res.sendFile(filePath);
})

webApp.get("/matchesPerYear", (req, res) => {
    const filePath = path.join(__dirname, "../public/output/matchesPerYear.json");
    res.sendFile(filePath);
})

webApp.get("/strikeRatesBySeason", (req, res) => {
    const filePath = path.join(__dirname, "../public/output/strikeRatesBySeason.json");
    res.sendFile(filePath);
})
webApp.get("/top10bowlersin2015", (req, res) => {
    const filePath = path.join(__dirname, "../public/output/top10bowlersin2015.json");
    res.sendFile(filePath);
})
webApp.get("/wonTossAndMatch", (req, res) => {
    const filePath = path.join(__dirname, "../public/output/wonTossAndMatch.json");
    res.sendFile(filePath);
})

webApp.listen(port, () => {
    console.log(`Server is running on ${port}`);
})



