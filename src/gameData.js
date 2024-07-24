// gameData.js

export const currentWeek = 1; // Set the current week here

export const weeklyGames = {
  1: [
    {
      home: { abbreviation: "NE", name: "New England Patriots", spread: -6.5 },
      away: { abbreviation: "KC", name: "Kansas City Chiefs", spread: 6.5 },
      winner: "NE", // Set the winner after the game is finished
    },
    {
      home: { abbreviation: "TB", name: "Tampa Bay Buccaneers", spread: -3.5 },
      away: { abbreviation: "DAL", name: "Dallas Cowboys", spread: 3.5 },
      winner: null, // null indicates the game hasn't been played yet
    },
    {
      home: { abbreviation: "NE", name: "New England Patriots", spread: -6.5 },
      away: { abbreviation: "KC", name: "Kansas City Chiefs", spread: 6.5 },
      winner: "NE", // Set the winner after the game is finished
    },
    {
      home: { abbreviation: "TB", name: "Tampa Bay Buccaneers", spread: -3.5 },
      away: { abbreviation: "DAL", name: "Dallas Cowboys", spread: 3.5 },
      winner: null, // null indicates the game hasn't been played yet
    },
    {
      home: { abbreviation: "NE", name: "New England Patriots", spread: -6.5 },
      away: { abbreviation: "KC", name: "Kansas City Chiefs", spread: 6.5 },
      winner: "NE", // Set the winner after the game is finished
    },
    {
      home: { abbreviation: "TB", name: "Tampa Bay Buccaneers", spread: -3.5 },
      away: { abbreviation: "DAL", name: "Dallas Cowboys", spread: 3.5 },
      winner: null, // null indicates the game hasn't been played yet
    },
    {
      home: { abbreviation: "NE", name: "New England Patriots", spread: -6.5 },
      away: { abbreviation: "KC", name: "Kansas City Chiefs", spread: 6.5 },
      winner: "NE", // Set the winner after the game is finished
    },
    {
      home: { abbreviation: "TB", name: "Tampa Bay Buccaneers", spread: -3.5 },
      away: { abbreviation: "DAL", name: "Dallas Cowboys", spread: 3.5 },
      winner: null, // null indicates the game hasn't been played yet
    },
    // Add more games for week 1
  ],
  2: [
    {
      home: { abbreviation: "SF", name: "San Francisco 49ers", spread: -4.5 },
      away: { abbreviation: "SEA", name: "Seattle Seahawks", spread: 4.5 },
      winner: null,
    },
    // Add more games for week 2
  ],
  // Add more weeks as needed
};

export const getGamesForWeek = (week) => {
  return weeklyGames[week] || [];
};
