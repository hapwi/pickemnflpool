import { getLatestAvailableWeek } from "./components/weekDates";

export const currentWeek = getLatestAvailableWeek();

export const weeklyGames = {
  1: [
    {
      home: {
        abbreviation: "HOU",
        name: "Houston Texans",
        spread: -4.0,
      },
      away: {
        abbreviation: "PHI",
        name: "Philadelphia Eagles",
        spread: 4.0,
      },
      winner: "NULL",
    },
    {
      home: {
        abbreviation: "IND",
        name: "Indianapolis Colts",
        spread: -2.5,
      },
      away: {
        abbreviation: "SEA",
        name: "Seattle Seahawks",
        spread: 2.5,
      },
      winner: "NULL",
    },
    {
      home: {
        abbreviation: "LAC",
        name: "Los Angeles Chargers",
        spread: -3.5,
      },
      away: {
        abbreviation: "DAL",
        name: "Dallas Cowboys",
        spread: 3.5,
      },
      winner: "NULL",
    },
    {
      home: {
        abbreviation: "ARI",
        name: "Arizona Cardinals",
        spread: -1.0,
      },
      away: {
        abbreviation: "MIN",
        name: "Minnesota Vikings",
        spread: 1.0,
      },
      winner: "NULL",
    },
    {
      home: {
        abbreviation: "TB",
        name: "Tampa Bay Buccaneers",
        spread: -9.5,
      },
      away: {
        abbreviation: "NYG",
        name: "New York Giants",
        spread: 9.5,
      },
      winner: "NULL",
    },
    {
      home: {
        abbreviation: "NE",
        name: "New England Patriots",
        spread: -6.0,
      },
      away: {
        abbreviation: "NYJ",
        name: "New York Jets",
        spread: 6.0,
      },
      winner: "NULL",
    },
    {
      home: {
        abbreviation: "CAR",
        name: "Carolina Panthers",
        spread: -3.0,
      },
      away: {
        abbreviation: "NO",
        name: "New Orleans Saints",
        spread: 3.0,
      },
      winner: "NULL",
    },
    {
      home: {
        abbreviation: "BUF",
        name: "Buffalo Bills",
        spread: -13.5,
      },
      away: {
        abbreviation: "MIA",
        name: "Miami Dolphins",
        spread: 13.5,
      },
      winner: "NULL",
    },
    {
      home: {
        abbreviation: "PIT",
        name: "Pittsburgh Steelers",
        spread: -3.0,
      },
      away: {
        abbreviation: "CLE",
        name: "Cleveland Browns",
        spread: 3.0,
      },
      winner: "NULL",
    },
  ],
  // ... (other weeks' data)
};

export const getGamesForWeek = (week) => {
  return weeklyGames[week] || [];
};

// Updated function to get winners for a specific week
export const getWinnersForWeek = (week) => {
  const games = weeklyGames[week] || [];
  return games.map((game) => ({
    winner: game.winner,
    home: game.home.abbreviation,
    away: game.away.abbreviation,
  }));
};

// New function to check if a pick is correct
export const isPickCorrect = (pick, gameResult) => {
  return (
    gameResult.winner !== "NULL" &&
    gameResult.winner !== "PUSH" &&
    gameResult.winner === pick
  );
};
