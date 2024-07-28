import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  Trophy,
  Calendar,
  Loader2,
  Check,
  X,
  Lock,
} from "lucide-react";
import { weeklyWinners } from "./weeklyWinners";
import { motion, AnimatePresence } from "framer-motion";
import weekDates, {
  isWeekAvailable,
  isWeekViewable,
  getLatestAvailableWeek,
} from "./weekDates";

// Clear sessionStorage on initial load if a timestamp is older than a threshold
const THRESHOLD = 1000; // 1 second
const now = new Date().getTime();
const lastVisit = sessionStorage.getItem("lastVisit");
if (!lastVisit || now - lastVisit > THRESHOLD) {
  sessionStorage.clear();
}
sessionStorage.setItem("lastVisit", now);

const apiKey = "AIzaSyCTIOtXB0RDa5Y5gubbRn328WIrqHwemrc";
const spreadsheetId = "1iTNStqnadp4ZyR7MRkSmvX5WeialS4WST6Yy-Qv8Reo";

const weekRanges = {
  1: "nfl-totals!C1:C1000",
  2: "nfl-totals!D1:D1000",
  3: "nfl-totals!E1:E1000",
  4: "nfl-totals!F1:F1000",
  5: "nfl-totals!G1:G1000",
  6: "nfl-totals!H1:H1000",
  7: "nfl-totals!I1:I1000",
  8: "nfl-totals!J1:J1000",
  9: "nfl-totals!K1:K1000",
  10: "nfl-totals!L1:L1000",
  11: "nfl-totals!M1:M1000",
  12: "nfl-totals!N1:N1000",
  13: "nfl-totals!O1:O1000",
  14: "nfl-totals!P1:P1000",
  15: "nfl-totals!Q1:Q1000",
  16: "nfl-totals!R1:R1000",
  17: "nfl-totals!S1:S1000",
  18: "nfl-totals!T1:T1000",
};

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(getLatestAvailableWeek());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weeklyWins, setWeeklyWins] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [picks, setPicks] = useState({});

  const fetchWeeklyWinData = useCallback(async (week) => {
    if (!isWeekAvailable(week)) {
      return [];
    }
    const range = weekRanges[week];
    console.log(
      `Fetching weekly win data for week ${week} with range ${range}`
    );
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
      );
      const data = await response.json();
      if (data.values) {
        const wins = data.values.slice(1).map((win) => win[0]);
        return wins;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching weekly win data:", error);
      return [];
    }
  }, []);

  const fetchLeaderboardData = useCallback(
    async (week) => {
      if (!isWeekAvailable(week)) {
        const latestAvailableWeek = getLatestAvailableWeek();
        setSelectedWeek(latestAvailableWeek);
        week = latestAvailableWeek;
      }

      const cachedData = sessionStorage.getItem(`leaderboardData_${week}`);
      if (cachedData) {
        const data = JSON.parse(cachedData);
        setLeaderboard(data.leaderboard);
        setWeeklyWins(data.weeklyWins);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/nfl-totals!A1:B1000?key=${apiKey}`
        );
        const data = await response.json();
        if (data.values) {
          const leaderboardData = data.values.slice(1); // Exclude header row
          const weeklyWinsData = await fetchWeeklyWinData(week);

          setLeaderboard(leaderboardData);
          setWeeklyWins(weeklyWinsData);

          const fetchedData = {
            leaderboard: leaderboardData,
            weeklyWins: weeklyWinsData,
          };

          sessionStorage.setItem(
            `leaderboardData_${week}`,
            JSON.stringify(fetchedData)
          );

          setIsLoading(false);
        }
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
        setIsLoading(false);
      }
    },
    [fetchWeeklyWinData]
  );

  useEffect(() => {
    fetchLeaderboardData(selectedWeek);
  }, [selectedWeek, fetchLeaderboardData]);

  const fetchPicksData = async (username) => {
    if (!isWeekViewable(selectedWeek)) {
      return;
    }
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/pemw${selectedWeek}!A1:R50?key=${apiKey}`
      );
      const data = await response.json();
      if (data.values) {
        const userPicks = data.values
          .slice(1)
          .filter((row) => row[0] === username);
        setPicks((prevPicks) => ({
          ...prevPicks,
          [username]: userPicks,
        }));
      }
    } catch (error) {
      console.error("Error fetching picks data:", error);
    }
  };

  const handleRowClick = (username) => {
    if (!isWeekViewable(selectedWeek)) {
      // Optionally show a message that the week is not viewable yet
      return;
    }
    if (expandedRows.includes(username)) {
      setExpandedRows(expandedRows.filter((user) => user !== username));
    } else {
      setExpandedRows([...expandedRows, username]);
      fetchPicksData(username);
    }
  };

  const handleWeekChange = (value) => {
    const weekNumber = Number(value);
    if (isWeekAvailable(weekNumber)) {
      setSelectedWeek(weekNumber);
      setExpandedRows([]);
      setPicks({});
    } else {
      console.log(`Week ${weekNumber} is not available yet.`);
    }
  };

  const renderPicks = (picksData) => {
    if (!picksData || picksData.length === 0) return null;

    const picks = picksData[0].slice(1).filter((pick) => pick.trim() !== "");
    const total = picks.pop();
    const winners = weeklyWinners[selectedWeek] || [];

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 p-3 sm:p-4 rounded-lg shadow-lg max-w-4xl mx-auto"
      >
        <h3 className="text-lg sm:text-xl font-bold text-blue-300 mb-3 sm:mb-4 text-center">
          Week {selectedWeek} Picks for {picksData[0][0]}
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          {picks.map((pick, index) => {
            const isCorrect = winners.includes(pick.trim());
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`bg-gray-700 rounded-lg p-2 sm:p-3 flex items-center justify-between ${
                  isCorrect ? "border-green-500" : "border-red-500"
                } border-2 shadow-md`}
              >
                <span className="text-sm sm:text-base font-medium truncate flex-grow text-gray-200">
                  {pick.trim()}
                </span>
                <div
                  className={`flex-shrink-0 ml-1 sm:ml-2 ${
                    isCorrect ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isCorrect ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-4 sm:mt-5 bg-blue-900 rounded-lg p-3 sm:p-4 shadow-lg"
        >
          <div className="flex justify-between items-center">
            <span className="text-base sm:text-lg font-semibold text-blue-200">
              Total Score
            </span>
            <span className="text-xl sm:text-2xl font-bold text-blue-100">
              {total}
            </span>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-300 mb-3">Error</h2>
          <p className="text-lg text-red-100">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center">
            <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500 mr-3" />
            NFL Pick'em Totals
          </h1>
          <div className="relative">
            <select
              className="appearance-none bg-gray-800 border border-gray-700 text-gray-300 py-2 px-4 pr-8 rounded-lg text-base leading-tight focus:outline-none focus:bg-gray-700 focus:border-gray-600 transition-colors duration-200"
              value={selectedWeek}
              onChange={(e) => handleWeekChange(e.target.value)}
            >
              {Object.keys(weekDates).map((week) => {
                const isAvailable = isWeekAvailable(Number(week));
                console.log(`Week ${week} available:`, isAvailable);
                return (
                  <option key={week} value={week} disabled={!isAvailable}>
                    Week {week}
                    {!isAvailable ? " (Not Available)" : ""}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </header>

        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
          <table className="w-full table-auto text-center">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Week
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {leaderboard.map((row, index) => (
                <React.Fragment key={index}>
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`transition-colors cursor-pointer ${
                      expandedRows.includes(row[0]) ? "bg-gray-700" : ""
                    }`}
                    onClick={() => handleRowClick(row[0])}
                  >
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 text-sm leading-5 font-semibold rounded-full bg-blue-900 text-blue-200">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="truncate font-medium text-sm sm:text-base">
                          {row[0]}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center text-base sm:text-lg font-semibold">
                      {row[1]}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <span className="text-base sm:text-lg font-medium">
                        {weeklyWins[index] || 0}
                      </span>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-center">
                      {isWeekViewable(selectedWeek) ? (
                        expandedRows.includes(row[0]) ? (
                          <ChevronUp
                            className="text-blue-400 inline-block"
                            size={20}
                          />
                        ) : (
                          <ChevronDown
                            className="text-blue-400 inline-block"
                            size={20}
                          />
                        )
                      ) : (
                        <Lock
                          className="text-gray-400 inline-block"
                          size={20}
                        />
                      )}
                    </td>
                  </motion.tr>
                  <AnimatePresence>
                    {expandedRows.includes(row[0]) &&
                      picks[row[0]] &&
                      isWeekViewable(selectedWeek) && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td colSpan="5" className="px-3 py-4 bg-gray-850">
                            {renderPicks(picks[row[0]])}
                          </td>
                        </motion.tr>
                      )}
                  </AnimatePresence>
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