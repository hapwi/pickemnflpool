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
import { weeklyWinners } from "./weeklyWinners";
import { motion, AnimatePresence } from "framer-motion";

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
  1: "C",
  2: "D",
  3: "E",
  4: "F",
  5: "G",
  6: "H",
  7: "I",
  8: "J",
  9: "K",
  10: "L",
  11: "M",
  12: "N",
  13: "O",
  14: "P",
  15: "Q",
  16: "R",
  17: "S",
  18: "T",
};

const StatCard = ({ icon: Icon, title, value }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="bg-gray-800 rounded-lg shadow-md p-4 flex items-center mb-4 sm:mb-0"
  >
    <div className="rounded-full p-2 mr-3 bg-gray-700">
      <Icon size={20} className="text-blue-400" />
    </div>
    <div>
      <h3 className="text-sm font-semibold text-gray-400">{title}</h3>
      <p className="text-lg font-bold text-gray-100">{value}</p>
    </div>
  </motion.div>
);

const StatsGrid = ({ userStats }) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
    <StatCard icon={TrendingUp} title="Ranking" value={`#${userStats.rank}`} />
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
      const totalResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/nfl-totals!A1:T1000?key=${apiKey}`
      );
      const totalData = await totalResponse.json();

      const weeklyData = await Promise.all(
        Object.keys(weekRanges).map(async (week) => {
          const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/pemw${week}!A1:R50?key=${apiKey}`
          );
          return response.json();
        })
      );

      if (totalData.values) {
        const userRow = totalData.values.find((row) => row[0] === userName);
        if (userRow) {
          const totalCorrectPicks = parseInt(userRow[1]) || 0;
          const weeklyPicks = userRow.slice(2).map((val) => parseInt(val) || 0);
          const rank = totalData.values.findIndex((row) => row[0] === userName);

          const history = Object.keys(weekRanges).map((week, index) => {
            const weekData = weeklyData[index].values;
            const userWeekRow = weekData.find((row) => row[0] === userName);
            const weekWinners = weeklyWinners[week] || [];
            const correctPicks = weeklyPicks[index];

            let picks = [];
            let finalScorePrediction = "";
            if (userWeekRow) {
              picks = userWeekRow.slice(1, -1).filter((pick) => pick !== "");
              finalScorePrediction = userWeekRow[userWeekRow.length - 1];
            }

            return {
              week: parseInt(week),
              correctPicks,
              totalPicks: picks.length,
              winRate: (correctPicks / picks.length) * 100,
              picks,
              winners: weekWinners,
              finalScorePrediction,
            };
          });

          const totalPicks = history.reduce(
            (sum, week) => sum + week.totalPicks,
            0
          );
          const winPercentage = (
            (totalCorrectPicks / totalPicks) *
            100
          ).toFixed(2);

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
        }
      }
      setIsLoading(false);
    } catch (err) {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
          {weekData.picks.map((pick, index) => {
            const isCorrect = weekData.winners.includes(pick.trim());
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`bg-gray-700 rounded-lg p-2 flex items-center justify-between ${
                  isCorrect ? "border-green-500" : "border-red-500"
                } border-2 shadow-md`}
              >
                <span className="truncate font-medium text-sm text-gray-200">
                  {pick.trim()}
                </span>
                <div className={isCorrect ? "text-green-500" : "text-red-500"}>
                  {isCorrect ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        {weekData.finalScorePrediction && (
          <div className="mt-4 bg-gray-700 rounded-lg p-3">
            <span className="font-medium text-sm text-gray-200">
              Total Prediction: {weekData.finalScorePrediction}
            </span>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center">
            <User className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 mr-3" />
            {userName}'s Profile
          </h1>
        </header>

        {userStats && <StatsGrid userStats={userStats} />}

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
                {pickHistory.map((week) => (
                  <React.Fragment key={week.week}>
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: week.week * 0.05 }}
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
  );
};

ProfilePage.propTypes = {
  userName: PropTypes.string.isRequired,
};

export default ProfilePage;
