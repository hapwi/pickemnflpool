import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  User,
  Award,
  Percent,
  TrendingUp,
  Loader2,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLatestAvailableWeek } from "./weekDates";
import { supabase } from "../supabaseClient";
import { getWinnersForWeek, isPickCorrect } from "../gameData";

// Clear sessionStorage on initial load if a timestamp is older than a threshold
const THRESHOLD = 1000; // 1 second
const now = new Date().getTime();
const lastVisit = sessionStorage.getItem("lastVisit");
if (!lastVisit || now - lastVisit > THRESHOLD) {
  sessionStorage.clear();
}
sessionStorage.setItem("lastVisit", now);

const StatCard = ({ icon: Icon, title, value }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between h-full w-full"
  >
    <div className="rounded-full p-2 bg-gray-700 flex-shrink-0">
      <Icon size={24} className="text-blue-400" />
    </div>
    <div className="flex flex-col items-end">
      <h3 className="text-sm font-semibold text-gray-400 mb-1">{title}</h3>
      <p className="text-xl font-bold text-gray-100">{value}</p>
    </div>
  </motion.div>
);

const StatsGrid = ({ userStats }) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8 w-full">
    <StatCard
      icon={Award}
      title="Correct Picks"
      value={userStats.totalCorrectPicks}
    />
    <StatCard icon={User} title="Total Picks" value={userStats.totalPicks} />
    <StatCard
      icon={Percent}
      title="Win %"
      value={`${userStats.winPercentage}%`}
    />
    <StatCard icon={TrendingUp} title="Ranking" value={`# ${userStats.rank}`} />
  </div>
);

const ProfilePage = ({ userName }) => {
  const [userStats, setUserStats] = useState(null);
  const [pickHistory, setPickHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedWeeks, setExpandedWeeks] = useState([]);

  const fetchUserData = useCallback(async () => {
    const cachedData = sessionStorage.getItem(`profileData_${userName}`);
    if (cachedData) {
      const data = JSON.parse(cachedData);
      setUserStats(data.userStats);
      setPickHistory(data.pickHistory);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch all user picks from Supabase
      const { data: allUserPicks, error: userPicksError } = await supabase
        .from("user_picks")
        .select("*");

      if (userPicksError) throw userPicksError;

      const latestWeek = getLatestAvailableWeek();

      // Calculate total correct picks for all users
      const usersTotalCorrectPicks = {};
      allUserPicks.forEach((pick) => {
        if (pick.week <= latestWeek) {
          const weekResults = getWinnersForWeek(pick.week);
          const correctPicks = Object.entries(pick.picks).filter(
            ([gameIndex, teamPick]) =>
              isPickCorrect(teamPick, weekResults[gameIndex])
          ).length;

          if (!usersTotalCorrectPicks[pick.username]) {
            usersTotalCorrectPicks[pick.username] = 0;
          }
          usersTotalCorrectPicks[pick.username] += correctPicks;
        }
      });

      // Sort users by total correct picks and determine rank
      const sortedUsers = Object.entries(usersTotalCorrectPicks).sort(
        ([, a], [, b]) => b - a
      );
      const rank = sortedUsers.findIndex(([user]) => user === userName) + 1;

      // Calculate user's stats
      let totalCorrectPicks = 0;
      let totalPicks = 0;
      const history = [];

      allUserPicks
        .filter((pick) => pick.username === userName)
        .forEach((weekData) => {
          if (weekData.week <= latestWeek) {
            const weekResults = getWinnersForWeek(weekData.week);
            const picks = Object.entries(weekData.picks);
            const correctPicks = picks.filter(([gameIndex, pick]) =>
              isPickCorrect(pick, weekResults[gameIndex])
            ).length;

            totalCorrectPicks += correctPicks;
            totalPicks += picks.length;

            history.push({
              week: weekData.week,
              correctPicks,
              totalPicks: picks.length,
              winRate:
                picks.length > 0 ? (correctPicks / picks.length) * 100 : 0,
              picks: weekData.picks,
              results: weekResults,
              finalScorePrediction: weekData.tiebreaker,
            });
          }
        });

      // Sort the history array by week number in descending order
      history.sort((a, b) => b.week - a.week);

      const winPercentage =
        totalPicks > 0
          ? ((totalCorrectPicks / totalPicks) * 100).toFixed(2)
          : "0.00";

      const fetchedData = {
        userStats: {
          totalCorrectPicks,
          totalPicks,
          winPercentage,
          rank,
        },
        pickHistory: history,
      };

      sessionStorage.setItem(
        `profileData_${userName}`,
        JSON.stringify(fetchedData)
      );

      setUserStats(fetchedData.userStats);
      setPickHistory(fetchedData.pickHistory);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data. Please try again later.");
      setIsLoading(false);
    }
  }, [userName]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const toggleWeekExpansion = (week) => {
    setExpandedWeeks((prev) =>
      prev.includes(week) ? prev.filter((w) => w !== week) : [...prev, week]
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

  const renderPicks = (weekData) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {Object.entries(weekData.picks).map(([gameIndex, pick], index) => {
            const gameResult = weekData.results[gameIndex];
            const isCorrect = isPickCorrect(pick, gameResult);
            const isPush = gameResult.winner === "PUSH";
            const isNull = gameResult.winner === "NULL";
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`bg-gray-700 rounded-lg p-2 sm:p-3 relative ${
                  isNull
                    ? "border-gray-500"
                    : isPush
                    ? "border-yellow-500"
                    : isCorrect
                    ? "border-green-500"
                    : "border-red-500"
                } border-2 shadow-md`}
              >
                <div className="flex justify-center items-center h-full">
                  <span className="text-sm sm:text-base font-medium text-center text-gray-200">
                    {pick.trim()}
                  </span>
                </div>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  {isPush ? (
                    <span className="text-xs text-yellow-500">PUSH</span>
                  ) : isNull ? (
                    <span className="text-xs"></span>
                  ) : isCorrect ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        {weekData.finalScorePrediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="mt-4 sm:mt-5 bg-blue-900 rounded-lg p-3 sm:p-4 shadow-lg"
          >
            <div className="flex justify-between items-center">
              <span className="text-base sm:text-lg font-semibold text-blue-200">
                Total Prediction
              </span>
              <span className="text-xl sm:text-2xl font-bold text-blue-100">
                {weekData.finalScorePrediction}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const PickHistory = [...pickHistory];

  return (
    <div className="min-h-screen text-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto flex flex-col">
        <header className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center justify-center">
            <User className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 mr-3" />
            {userName}'s Stats
          </h1>
        </header>

        <section className="mb-1">
          {userStats && <StatsGrid userStats={userStats} />}
        </section>

        <div className="flex-grow">
          <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
            <div className="overflow-hidden">
              <table className="w-full table-auto">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Week
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Correct
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Win Rate
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {PickHistory.map((week, index) => (
                    <React.Fragment key={week.week}>
                      <motion.tr
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`hover:bg-gray-750 transition-colors cursor-pointer ${
                          expandedWeeks.includes(week.week) ? "bg-gray-700" : ""
                        }`}
                        onClick={() => toggleWeekExpansion(week.week)}
                      >
                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-300">
                            Week {week.week}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          <span className="text-sm text-gray-300">
                            {week.correctPicks}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          <span className="text-sm text-gray-300">
                            {week.totalPicks}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          <span className="text-sm text-gray-300">
                            {week.winRate.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-2 py-3 text-center whitespace-nowrap">
                          {expandedWeeks.includes(week.week) ? (
                            <ChevronUp
                              className="text-blue-400 inline-block"
                              size={20}
                            />
                          ) : (
                            <ChevronDown
                              className="text-blue-400 inline-block"
                              size={20}
                            />
                          )}
                        </td>
                      </motion.tr>
                      <AnimatePresence>
                        {expandedWeeks.includes(week.week) && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td colSpan="5" className="px-3 py-4 bg-gray-750">
                              {renderPicks(week)}
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
      </div>
    </div>
  );
};

ProfilePage.propTypes = {
  userName: PropTypes.string.isRequired,
};

export default ProfilePage;
