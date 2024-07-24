import React, { useState, useEffect } from "react";
import { User, Award, Percent, TrendingUp } from "lucide-react";

const ProfilePage = ({ userName }) => {
  const [userStats, setUserStats] = useState(null);
  const [pickHistory, setPickHistory] = useState([]);

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
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value }) => (
    <div className="bg-gray-700 rounded-lg shadow-md p-4 flex items-center">
      <div className="rounded-full p-2 mr-3 bg-gray-800">
        <Icon size={20} className="text-gray-300" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
        <p className="text-lg font-bold text-gray-100">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="bg-gray-700 rounded-lg shadow-lg p-6 mb-6 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
            <div className="w-20 h-20 bg-gray-800 text-gray-200 rounded-full flex items-center justify-center text-3xl font-bold mb-4 sm:mb-0 sm:mr-6">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold">{userName}</h1>
              <p className="text-lg sm:text-xl text-gray-300">
                NFL Pick'em Pro
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-lg sm:text-xl text-gray-300">Rank</p>
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

      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Week
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Correct
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Win Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {pickHistory.map((week) => (
                <tr
                  key={week.week}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-200">
                    Week {week.week}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {week.correctPicks}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {week.totalPicks}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
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
