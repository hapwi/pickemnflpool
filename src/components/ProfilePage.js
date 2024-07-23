import React, { useState, useEffect } from "react";

const ProfilePage = ({ userName }) => {
  const [userStats, setUserStats] = useState(null);
  const [pickHistory, setPickHistory] = useState([]);

  useEffect(() => {
    // Simulate fetching user stats and pick history
    // In a real application, you would make API calls here
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
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {userName}'s Profile
      </h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            User Statistics
          </h2>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Total Correct Picks
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userStats.totalCorrectPicks}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total Picks</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userStats.totalPicks}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Win Percentage
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userStats.winPercentage}%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Pick History</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
              <tr key={week.week}>
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
