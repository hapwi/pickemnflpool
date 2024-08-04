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
