document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/bestEconomyInSuperOver")
    .then((response) => {
      if (!response.ok) {
        throw new Error("error occurred in bestEconomy response");
      }
      return response.json();
    })
    .then((bestEconomyData) => {
      const bowler = bestEconomyData[0];
      const economyRate = bestEconomyData[1].economy;
      Highcharts.chart("best-economy", {
        chart: {
          type: "column",
        },
        title: {
          text: "Bowler with Best Economy in Super Overs",
        },
        xAxis: {
          categories: [bowler],
        },
        yAxis: {
          title: {
            text: "Economy Rate",
          },
        },
        series: [
          {
            name: "Economy Rate",
            data: [economyRate],
          },
        ],
      });
      return fetch("http://localhost:3000/dismissedByOther");
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("error occurred in dismissed by other data");
      } else {
        return response.json();
      }
    })
    .then((dishmissedData) => {
      var players = dishmissedData[0].split("-");

      // Creating chart
      Highcharts.chart("dismissed", {
        chart: {
          type: "bar",
        },
        title: {
          text: "Max Dismissed Player",
        },
        xAxis: {
          categories: players,
        },
        yAxis: {
          title: {
            text: "Runs",
          },
        },
        series: [
          {
            name: "Runs",
            data: [dishmissedData[1]],
          },
        ],
      });
      return fetch("http://localhost:3000/extraRunsConcededPerTeam2016");
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("error occurred during getting data of extraRunsConcededPerTeam2016");
      }
      return response.json();
    })
    .then((extraRunsData) => {
      Highcharts.chart("extraRun", {
        chart: {
          type: "bar",
        },
        title: {
          text: "Extra Runs By Team in 2016",
        },
        xAxis: {
          categories: Object.keys(extraRunsData),
          title: {
            text: "Teams",
          },
        },
        yAxis: {
          title: {
            text: "Runs",
          },
        },
        series: [
          {
            name: "Runs",
            data: Object.values(extraRunsData),
          },
        ],
      });
      return fetch("http://localhost:3000/highestPlayerOfTheMatchBySeason");
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("error occurred in highest Player Of The Match By Season data");
      }
      return response.json();
    })
    .then((highestPlayerData) => {
      Highcharts.chart("highestPlayer", {
        chart: {
          type: "column",
        },
        title: {
          text: "Player Awards Over Years",
        },
        xAxis: {
          categories: Object.keys(highestPlayerData),
          title: {
            text: "years",
          },
        },
        yAxis: {
          title: {
            text: "Awards",
          },
        },
        series: [
          {
            name: "Player",
            data: Object.values(highestPlayerData),
          },
        ],
      });
      return fetch("http://localhost:3000/matchesPerYear");
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("error occurred while fetching data of matches Per Year");
      }
      return response.json();
    })
    .then((matchesPerYear) => {
      const validYears = Object.keys(matchesPerYear);
      const seriesData = [
        {
          name: "Matches Won",
          data: validYears.map((year) => matchesPerYear[year]),
        },
      ];

      Highcharts.chart("matchePerYear", {
        chart: {
          type: "column",
        },
        title: {
          text: "Matches Won Per Year",
        },
        xAxis: {
          categories: validYears,
        },
        yAxis: {
          title: {
            text: "Matches Won",
          },
        },
        series: seriesData,
      });

      return fetch("http://localhost:3000/strikeRatesBySeason");
    })
    .then((strikeRateData) => {
      var seriesData = Object.keys(strikeRateData).map(function (year) {
        return {
          name: year,
          data: Object.entries(strikeRateData[year]).map(function (entry) {
            return entry[1].runs;
          }),
        };
      });

      // Create Highcharts chart
      Highcharts.chart("strike_rate", {
        chart: {
          type: "column",
        },
        title: {
          text: "StrikeRate Of Batsman Per Years",
        },
        xAxis: {
          categories: Object.keys(strikeRateData.undefined),
        },
        yAxis: {
          title: {
            text: "Runs",
          },
        },
        series: seriesData,
      });
      return fetch("http://localhost:3000/top10bowlersin2015");
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("erro occured in top10 bowlers response");
      }
      return response.json();
    })
    .then((playerNames) => {
      Highcharts.chart("top-10-bowlers", {
        chart: {
          type: "bar",
        },
        title: {
          text: "Top 10 Bowlers",
        },
        xAxis: {
          categories: playerNames,
          title: {
            text: "Players",
          },
        },
        yAxis: {
          title: {
            text: "Count",
          },
        },
        series: [
          {
            name: "Player Count",
            data: Array(playerNames.length).fill(1), // Assign a count of 1 to each player
          },
        ],
      });
      return fetch("http://localhost:5000/wonTossAndMatch");
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("error occured in wonAndLossToss response");
      }
      return response.json();
    })
    .then((wonAndLossData) => {
      Highcharts.chart("won-and-loss", {
        chart: {
          type: "bar",
        },
        title: {
          text: "Count Of Team Won the Match And Loss The Toss",
        },
        xAxis: {
          categories: Object.keys(wonAndLossData),
          title: {
            text: "Team",
          },
        },
        yAxis: {
          title: {
            text: "Count",
          },
        },
        series: [
          {
            name: "Team count",
            data: Object.values(wonAndLossData),
          },
        ],
      });
    })
    .catch((err) => {
      console.error("error occured in fetching", err);
    });
});
