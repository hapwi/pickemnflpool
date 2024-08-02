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
import { supabase } from "../supabaseClient";

// Clear sessionStorage on initial load if a timestamp is older than a threshold
const THRESHOLD = 1000; // 1 second
const now = new Date().getTime();
const lastVisit = sessionStorage.getItem("lastVisit");
if (!lastVisit || now - lastVisit > THRESHOLD) {
  sessionStorage.clear();
}
sessionStorage.setItem("lastVisit", now);

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(getLatestAvailableWeek());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [picks, setPicks] = useState({});
  const [weeklyCorrectPicks, setWeeklyCorrectPicks] = useState({});

  const fetchWeeklyWinData = useCallback(async (week) => {
    if (!isWeekAvailable(week)) {
      return [];
    }
    try {
      const { data, error } = await supabase
        .from("user_picks")
        .select("username")
        .eq("week", week)
        .order("tiebreaker", { ascending: false });

      if (error) throw error;

      console.log(`Weekly Win Data for Week ${week}:`, data);
      return data.map((row) => row.username);
    } catch (error) {
      console.error("Error fetching weekly win data:", error);
      return [];
    }
  }, []);

  const fetchPicksData = async (week) => {
    if (!isWeekViewable(week)) {
      return {};
    }
    try {
      const { data, error } = await supabase
        .from("user_picks")
        .select("username, picks, tiebreaker")
        .eq("week", week);

      if (error) throw error;

      console.log(`Picks Data for Week ${week}:`, data);
      const picksData = data.reduce((acc, row) => {
        acc[row.username] = {
          username: row.username,
          picks: row.picks,
          tiebreaker: row.tiebreaker,
        };
        return acc;
      }, {});

      return picksData;
    } catch (error) {
      console.error("Error fetching picks data:", error);
      return {};
    }
  };

  const fetchLeaderboardData = useCallback(async () => {
    setIsLoading(true);

    const cachedData = sessionStorage.getItem(
      `leaderboardData_week_${selectedWeek}`
    );
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setLeaderboard(parsedData.leaderboard);
      setPicks(parsedData.picks);
      setWeeklyCorrectPicks(parsedData.weeklyCorrectPicks);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch all user picks across all weeks
      const { data: allUserPicks, error: allUserPicksError } = await supabase
        .from("user_picks")
        .select("username, week, picks");

      if (allUserPicksError) throw allUserPicksError;

      console.log("All User Picks Data:", allUserPicks);

      // Calculate total correct picks and weekly correct picks for each user
      const userCorrectPicks = {};
      const userWeeklyCorrectPicks = {};

      allUserPicks.forEach(({ username, week, picks }) => {
        if (!userCorrectPicks[username]) {
          userCorrectPicks[username] = 0;
        }
        if (!userWeeklyCorrectPicks[username]) {
          userWeeklyCorrectPicks[username] = {};
        }

        const weekWinners = weeklyWinners[week] || [];
        console.log(`Week ${week} Winners:`, weekWinners);

        let userPicks;

        // Check if picks is already an object
        if (typeof picks === "object") {
          userPicks = picks;
        } else {
          try {
            userPicks = JSON.parse(picks);
          } catch (error) {
            console.error(
              `Error parsing picks for user ${username} in week ${week}:`,
              error,
              picks
            );
            userPicks = {};
          }
        }

        console.log(`User ${username} Picks for Week ${week}:`, userPicks);

        userWeeklyCorrectPicks[username][week] = 0;
        Object.values(userPicks).forEach((pick) => {
          if (weekWinners.includes(pick)) {
            userCorrectPicks[username] += 1;
            userWeeklyCorrectPicks[username][week] += 1;
          }
        });
      });

      const leaderboardData = Object.entries(userCorrectPicks).map(
        ([username, totalCorrectPicks]) => [username, totalCorrectPicks]
      );

      const weeklyWinsData = await fetchWeeklyWinData(selectedWeek);
      const picksData = await fetchPicksData(selectedWeek);

      setLeaderboard(leaderboardData);
      setPicks(picksData);
      setWeeklyCorrectPicks(userWeeklyCorrectPicks);

      const fetchedData = {
        leaderboard: leaderboardData,
        weeklyWins: weeklyWinsData,
        picks: picksData,
        weeklyCorrectPicks: userWeeklyCorrectPicks,
      };

      console.log(`Fetched Leaderboard Data:`, fetchedData);
      sessionStorage.setItem(
        `leaderboardData_week_${selectedWeek}`,
        JSON.stringify(fetchedData)
      );

      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to fetch data. Please try again later.");
      setIsLoading(false);
    }
  }, [fetchWeeklyWinData, selectedWeek]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  const handleRowClick = (username) => {
    if (!isWeekViewable(selectedWeek)) {
      // Optionally show a message that the week is not viewable yet
      return;
    }
    if (expandedRows.includes(username)) {
      setExpandedRows(expandedRows.filter((user) => user !== username));
    } else {
      setExpandedRows([...expandedRows, username]);
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
    if (!picksData || !picksData.picks) return null;

    const picks = Object.entries(picksData.picks);
    const tiebreaker = picksData.tiebreaker;
    const winners = weeklyWinners[selectedWeek] || [];

    console.log(
      `Rendering Picks for ${picksData.username} in Week ${selectedWeek}:`,
      picks
    );
    console.log(`Winners for Week ${selectedWeek}:`, winners);

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="bg-gray-800 p-3 sm:p-4 rounded-lg shadow-lg max-w-4xl mx-auto"
        style={{ willChange: "opacity, transform" }}
      >
        <h3 className="text-lg sm:text-xl font-bold text-blue-300 mb-3 sm:mb-4 text-center">
          Week {selectedWeek} Picks for {picksData.username}
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          {picks.map(([index, pick], i) => {
            const isCorrect = winners.includes(pick);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15, delay: i * 0.03 }}
                className={`bg-gray-700 rounded-lg p-2 sm:p-3 flex items-center justify-between ${
                  isCorrect ? "border-green-500" : "border-red-500"
                } border-2 shadow-md`}
                style={{ willChange: "opacity, transform" }}
              >
                <span className="text-sm sm:text-base font-medium truncate flex-grow text-gray-200">
                  {pick}
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
          transition={{ duration: 0.2, delay: 0.1 }}
          className="mt-4 sm:mt-5 bg-blue-900 rounded-lg p-3 sm:p-4 shadow-lg"
          style={{ willChange: "opacity, transform" }}
        >
          <div className="flex justify-between items-center">
            <span className="text-base sm:text-lg font-semibold text-blue-200">
              Tiebreaker
            </span>
            <span className="text-xl sm:text-2xl font-bold text-blue-100">
              {tiebreaker}
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
    <div className="min-h-screen text-gray-100 p-4 sm:p-6">
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
                    transition={{ duration: 0.2 }}
                    className={`transition-colors cursor-pointer ${
                      expandedRows.includes(row[0]) ? "bg-gray-700" : ""
                    }`}
                    onClick={() => handleRowClick(row[0])}
                    style={{ willChange: "opacity, transform" }}
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
                    <td className="px-3 py-3 whitespace-nowrap text-center text-base sm:text-lg font-semibold">
                      {weeklyCorrectPicks[row[0]][selectedWeek] || 0}
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
                          transition={{ duration: 0.2 }}
                          style={{ willChange: "opacity, transform" }}
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