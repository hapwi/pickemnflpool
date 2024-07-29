import axios from "axios";

export const currentWeek = 2; // Set the current week here

export const weeklyGames = {};

const fetchGames = async () => {
  try {
    const response = await axios.get(
      "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard"
    );
    const data = response.data;

    data.events.forEach((event) => {
      // Check if the event is part of the regular season
      if (event.season.type === 2) {
        // Regular season type ID is 2
        const weekNumber = event.week.number;
        if (!weeklyGames[weekNumber]) {
          weeklyGames[weekNumber] = [];
        }

        const homeTeam = event.competitions[0].competitors.find(
          (team) => team.homeAway === "home"
        ).team;
        const awayTeam = event.competitions[0].competitors.find(
          (team) => team.homeAway === "away"
        ).team;
        const odds = event.odds ? event.odds[0] : null;

        const game = {
          home: {
            abbreviation: homeTeam.abbreviation,
            name: homeTeam.displayName,
            spread: odds ? odds.homeTeamOdds.spread : null,
          },
          away: {
            abbreviation: awayTeam.abbreviation,
            name: awayTeam.displayName,
            spread: odds ? odds.awayTeamOdds.spread : null,
          },
          winner: null, // Initially set to null
        };

        weeklyGames[weekNumber].push(game);
      }
    });
  } catch (error) {
    console.error("Error fetching the NFL games:", error);
  }
};

fetchGames();

export const getGamesForWeek = (week) => {
  return weeklyGames[week] || [];
};
