import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

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
      <div className="px-4 py-3 bg-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Game
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pick
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {weekGames.map((game) => {
              const userPick = picks.find((p) => p.gameId === game.id);
              const pickedTeam = userPick
                ? userPick.pick === "home"
                  ? game.home
                  : game.away
                : null;
              return (
                <tr key={game.id}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
                    {game.away.abbreviation} @ {game.home.abbreviation}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
                    {pickedTeam
                      ? `${pickedTeam.abbreviation} (${
                          pickedTeam.spread > 0 ? "+" : ""
                        }${pickedTeam.spread})`
                      : "No pick"}
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
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">
        Leaderboard
      </h1>
      <div className="mb-6">
        <label
          htmlFor="week-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Week:
        </label>
        <div className="relative">
          <select
            id="week-select"
            value={selectedWeek}
            onChange={handleWeekChange}
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            {[1, 2, 3].map((week) => (
              <option key={week} value={week}>
                Week {week}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown size={20} />
          </div>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Rank
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total Correct
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Week {selectedWeek} Correct
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              ></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedLeaderboard.map((entry, index) => (
              <React.Fragment key={entry.id}>
                <tr
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } cursor-pointer hover:bg-gray-100`}
                  onClick={() => toggleRowExpansion(entry.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {entry.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-bold">
                    {calculateTotalPicks(entry.correctPicks)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {entry.correctPicks[selectedWeek]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {expandedRows[entry.id] ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                  </td>
                </tr>
                {expandedRows[entry.id] && (
                  <tr>
                    <td colSpan="5">
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
  );
};

export default LeaderboardPage;
