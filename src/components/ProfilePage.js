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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
      <div className="rounded-full p-3 mr-4 bg-gray-100">
        <Icon size={24} className="text-gray-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-800 text-3xl font-bold mr-6">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{userName}</h1>
              <p className="text-xl text-gray-300">NFL Pick'em Pro</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl text-gray-300">Rank</p>
            <p className="text-4xl font-bold">#{userStats.rank}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          title="Win Percentage"
          value={`${userStats.winPercentage}%`}
        />
        <StatCard
          icon={TrendingUp}
          title="Ranking"
          value={`#${userStats.rank}`}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Week
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correct Picks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Picks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Win Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pickHistory.map((week) => (
              <tr
                key={week.week}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Week {week.week}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {week.correctPicks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {week.totalPicks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {week.winRate.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfilePage;
