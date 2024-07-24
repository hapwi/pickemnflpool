import React, { useState, useEffect, useContext } from "react";
import { User, Award, Percent, TrendingUp } from "lucide-react";
import { DarkModeContext } from "../App";

const ProfilePage = ({ userName }) => {
  const [userStats, setUserStats] = useState(null);
  const [pickHistory, setPickHistory] = useState([]);
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    // Simulate fetching user stats and pick history
    setTimeout(() => {
      setUserStats({
        totalCorrectPicks: 45,
        totalPicks: 60,
        winPercentage: 75,
        rank: 3,
      });
      setPickHistory([
        { week: 1, correctPicks: 19, totalPicks: 28, winRate: 67.86 },
        { week: 2, correctPicks: 14, totalPicks: 16, winRate: 87.5 },
        { week: 3, correctPicks: 12, totalPicks: 16, winRate: 75.0 },
      ]);
    }, 1000);
  }, [userName]);

  if (!userStats) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${
            darkMode ? "border-blue-400" : "border-blue-500"
          }`}
        ></div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value }) => (
    <div
      className={`${
        darkMode ? "bg-gray-700" : "bg-white"
      } rounded-lg shadow-md p-4 flex items-center`}
    >
      <div
        className={`rounded-full p-2 mr-3 ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <Icon
          size={20}
          className={darkMode ? "text-gray-300" : "text-gray-600"}
        />
      </div>
      <div>
        <h3
          className={`text-sm font-semibold ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-lg font-bold ${
            darkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div
        className={`${
          darkMode ? "bg-gray-700" : "bg-gray-700"
        } rounded-lg shadow-lg p-6 mb-6 text-white`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
            <div
              className={`w-20 h-20 ${
                darkMode
                  ? "bg-gray-800 text-gray-200"
                  : "bg-white text-gray-800"
              } rounded-full flex items-center justify-center text-3xl font-bold mb-4 sm:mb-0 sm:mr-6`}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold">{userName}</h1>
              <p
                className={`text-lg sm:text-xl ${
                  darkMode ? "text-gray-300" : "text-gray-300"
                }`}
              >
                NFL Pick'em Pro
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p
              className={`text-lg sm:text-xl ${
                darkMode ? "text-gray-300" : "text-gray-300"
              }`}
            >
              Rank
            </p>
            <p className="text-3xl sm:text-4xl font-bold">#{userStats.rank}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Award}
          title="Correct Picks"
          value={userStats.totalCorrectPicks}
        />
        <StatCard
          icon={User}
          title="Total Picks"
          value={userStats.totalPicks}
        />
        <StatCard
          icon={Percent}
          title="Win %"
          value={`${userStats.winPercentage}%`}
        />
        <StatCard
          icon={TrendingUp}
          title="Ranking"
          value={`#${userStats.rank}`}
        />
      </div>

      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md overflow-hidden`}
      >
        <div className="overflow-x-auto">
          <table
            className={`min-w-full divide-y ${
              darkMode ? "divide-gray-700" : "divide-gray-200"
            }`}
          >
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Week
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Correct
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Total
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Win Rate
                </th>
              </tr>
            </thead>
            <tbody
              className={`${darkMode ? "bg-gray-800" : "bg-white"} divide-y ${
                darkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {pickHistory.map((week) => (
                <tr
                  key={week.week}
                  className={`${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  } transition-colors`}
                >
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    Week {week.week}
                  </td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {week.correctPicks}
                  </td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {week.totalPicks}
                  </td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {week.winRate.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
