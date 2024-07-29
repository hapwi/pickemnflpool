// gameData.js

export const currentWeek = 1; // Set the current week here

export const weeklyGames = {
  1: [
    {
      home: {
        abbreviation: "KC",
        name: "Kansas City Chiefs",
        spread: -3.5,
      },
      away: {
        abbreviation: "DET",
        name: "Detroit Lions",
        spread: 3.5,
      },
      winner: null,
    },
    {
      home: {
        abbreviation: "NYJ",
        name: "New York Jets",
        spread: -2,
      },
      away: {
        abbreviation: "BUF",
        name: "Buffalo Bills",
        spread: 2,
      },
      winner: null,
    },
  ],
  2: [
    {
      home: {
        abbreviation: "DAL",
        name: "Dallas Cowboys",
        spread: -3,
      },
      away: {
        abbreviation: "NYJ",
        name: "New York Jets",
        spread: 3,
      },
      winner: null,
    },
    {
      home: {
        abbreviation: "ARI",
        name: "Arizona Cardinals",
        spread: 5.5,
      },
      away: {
        abbreviation: "NYG",
        name: "New York Giants",
        spread: -5.5,
      },
      winner: null,
    },
  ],
  3: [
    {
      home: {
        abbreviation: "SF",
        name: "San Francisco 49ers",
        spread: -10,
      },
      away: {
        abbreviation: "NYG",
        name: "New York Giants",
        spread: 10,
      },
      winner: null,
    },
    {
      home: {
        abbreviation: "KC",
        name: "Kansas City Chiefs",
        spread: -12.5,
      },
      away: {
        abbreviation: "CHI",
        name: "Chicago Bears",
        spread: 12.5,
      },
      winner: null,
    },
  ],
};

export const getGamesForWeek = (week) => {
  return weeklyGames[week] || [];
};
