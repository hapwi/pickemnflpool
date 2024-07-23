import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { User, Award, Percent } from "lucide-react";

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
      });
      setPickHistory([
        { week: 3, correctPicks: 12, totalPicks: 16 },
        { week: 2, correctPicks: 14, totalPicks: 16 },
        { week: 1, correctPicks: 19, totalPicks: 28 },
      ]);
    }, 1000);
  }, [userName]);

  if (!userStats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div
      className={`bg-white rounded-lg shadow-md p-6 flex items-center ${color}`}
    >
      <div className="rounded-full p-3 mr-4">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {userName}
        </h1>
        <p className="text-center text-gray-600">NFL Pick'em Enthusiast</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Award}
          title="Correct Picks"
          value={userStats.totalCorrectPicks}
          color="text-green-500"
        />
        <StatCard
          icon={User}
          title="Total Picks"
          value={userStats.totalPicks}
          color="text-blue-500"
        />
        <StatCard
          icon={Percent}
          title="Win Percentage"
          value={`${userStats.winPercentage}%`}
          color="text-purple-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Performance Chart
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pickHistory.reverse()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                label={{ value: "Week", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{ value: "Picks", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Bar dataKey="correctPicks" name="Correct Picks" fill="#4CAF50" />
              <Bar dataKey="totalPicks" name="Total Picks" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
                Percentage
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
                  {((week.correctPicks / week.totalPicks) * 100).toFixed(2)}%
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
