import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Trophy } from "lucide-react";

// Fake data for leaderboard entries (unchanged)
const fakeLeaderboardData = [
  {
    id: 1,
    name: "John Doe",
    correctPicks: { 1: 10, 2: 8, 3: 12 },
    picks: {
      1: [
        { gameId: 1, pick: "home" },
        { gameId: 2, pick: "away" },
        { gameId: 3, pick: "home" },
      ],
      2: [
        { gameId: 4, pick: "home" },
        { gameId: 5, pick: "away" },
        { gameId: 6, pick: "away" },
      ],
      3: [
        { gameId: 7, pick: "away" },
        { gameId: 8, pick: "home" },
        { gameId: 9, pick: "home" },
      ],
    },
  },
  // ... other entries
];

// Fake data for games (unchanged)
const fakeGames = {
  1: [
    {
      id: 1,
      home: { abbreviation: "NE", spread: -6.5 },
      away: { abbreviation: "KC", spread: 6.5 },
    },
    {
      id: 2,
      home: { abbreviation: "TB", spread: -3.5 },
      away: { abbreviation: "DAL", spread: 3.5 },
    },
    {
      id: 3,
      home: { abbreviation: "SF", spread: -4.5 },
      away: { abbreviation: "SEA", spread: 4.5 },
    },
  ],
  // ... games for weeks 2 and 3
};

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLeaderboard(fakeLeaderboardData);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch leaderboard. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const calculateTotalPicks = (picks) => {
    return Object.values(picks).reduce((sum, current) => sum + current, 0);
  };

  const sortedLeaderboard = [...leaderboard].sort(
    (a, b) =>
      calculateTotalPicks(b.correctPicks) - calculateTotalPicks(a.correctPicks)
  );

  const handleWeekChange = (event) => {
    setSelectedWeek(Number(event.target.value));
    setExpandedRows({});
  };

  const toggleRowExpansion = (userId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const renderPicksTable = (picks, userId) => {
    const weekGames = fakeGames[selectedWeek] || [];
    return (
      <div className="px-4 py-3 bg-gray-800 rounded-b-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                Game
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                Pick
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {weekGames.map((game) => {
              const userPick = picks.find((p) => p.gameId === game.id);
              const pickedTeam = userPick
                ? userPick.pick === "home"
                  ? game.home
                  : game.away
                : null;
              return (
                <tr key={game.id} className="hover:bg-gray-700">
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-200 text-center">
                    {game.away.abbreviation} @ {game.home.abbreviation}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-200 text-center">
                    {pickedTeam ? (
                      <span>
                        {pickedTeam.abbreviation} (
                        {pickedTeam.spread > 0 ? "+" : ""}
                        {pickedTeam.spread})
                      </span>
                    ) : (
                      "No pick"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-gray-700 rounded-lg shadow-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 mr-4" />
            <div>
              <h1 className="text-2xl font-bold">Leaderboard</h1>
              <p className="text-gray-300">See how you stack up</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-300">Players</p>
            <p className="text-3xl font-bold">{sortedLeaderboard.length}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="week-select"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Select Week:
        </label>
        <select
          id="week-select"
          value={selectedWeek}
          onChange={handleWeekChange}
          className="block w-full bg-gray-700 text-gray-200 border border-gray-600 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {[1, 2, 3].map((week) => (
            <option key={week} value={week}>
              Week {week}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Week {selectedWeek}
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider w-10"></th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {sortedLeaderboard.map((entry, index) => (
                <React.Fragment key={entry.id}>
                  <tr
                    onClick={() => toggleRowExpansion(entry.id)}
                    className={`${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                    } hover:bg-gray-700 transition-colors duration-150 ease-in-out cursor-pointer`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-200 text-center">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200 text-center">
                      {entry.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-200 text-center">
                      {calculateTotalPicks(entry.correctPicks)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200 text-center">
                      {entry.correctPicks[selectedWeek]}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200 text-center">
                      {expandedRows[entry.id] ? (
                        <ChevronDown size={20} className="text-blue-400" />
                      ) : (
                        <ChevronRight size={20} className="text-blue-400" />
                      )}
                    </td>
                  </tr>
                  {expandedRows[entry.id] && (
                    <tr>
                      <td colSpan="5" className="px-4 py-3">
                        {renderPicksTable(entry.picks[selectedWeek], entry.id)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
