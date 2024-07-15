import React, { useState } from "react";

const teams = [
  {
    home: {
      abbreviation: "NE",
      name: "New England Patriots",
      spread: -6.5,
    },
    away: {
      abbreviation: "KC",
      name: "Kansas City Chiefs",
      spread: 6.5,
    },
  },
  {
    home: {
      abbreviation: "TB",
      name: "Tampa Bay Buccaneers",
      spread: -3.5,
    },
    away: {
      abbreviation: "DAL",
      name: "Dallas Cowboys",
      spread: 3.5,
    },
  },
  {
    home: {
      abbreviation: "SF",
      name: "San Francisco 49ers",
      spread: -4.5,
    },
    away: {
      abbreviation: "SEA",
      name: "Seattle Seahawks",
      spread: 4.5,
    },
  },
  {
    home: {
      abbreviation: "PIT",
      name: "Pittsburgh Steelers",
      spread: -2.5,
    },
    away: {
      abbreviation: "BAL",
      name: "Baltimore Ravens",
      spread: 2.5,
    },
  },
  {
    home: {
      abbreviation: "NO",
      name: "New Orleans Saints",
      spread: -7.5,
    },
    away: {
      abbreviation: "GB",
      name: "Green Bay Packers",
      spread: 7.5,
    },
  },
  {
    home: {
      abbreviation: "LAR",
      name: "Los Angeles Rams",
      spread: -5.5,
    },
    away: {
      abbreviation: "CHI",
      name: "Chicago Bears",
      spread: 5.5,
    },
  },
  {
    home: {
      abbreviation: "BUF",
      name: "Buffalo Bills",
      spread: -9.5,
    },
    away: {
      abbreviation: "MIA",
      name: "Miami Dolphins",
      spread: 9.5,
    },
  },
  {
    home: {
      abbreviation: "IND",
      name: "Indianapolis Colts",
      spread: -1.5,
    },
    away: {
      abbreviation: "TEN",
      name: "Tennessee Titans",
      spread: 1.5,
    },
  },
  {
    home: {
      abbreviation: "CLE",
      name: "Cleveland Browns",
      spread: -3.5,
    },
    away: {
      abbreviation: "CIN",
      name: "Cincinnati Bengals",
      spread: 3.5,
    },
  },
  {
    home: {
      abbreviation: "DEN",
      name: "Denver Broncos",
      spread: -6.5,
    },
    away: {
      abbreviation: "LV",
      name: "Las Vegas Raiders",
      spread: 6.5,
    },
  },
  {
    home: {
      abbreviation: "ARI",
      name: "Arizona Cardinals",
      spread: -2.5,
    },
    away: {
      abbreviation: "MIN",
      name: "Minnesota Vikings",
      spread: 2.5,
    },
  },
  {
    home: {
      abbreviation: "CAR",
      name: "Carolina Panthers",
      spread: -1.5,
    },
    away: {
      abbreviation: "NYJ",
      name: "New York Jets",
      spread: 1.5,
    },
  },
  {
    home: {
      abbreviation: "HOU",
      name: "Houston Texans",
      spread: -4.5,
    },
    away: {
      abbreviation: "JAX",
      name: "Jacksonville Jaguars",
      spread: 4.5,
    },
  },
];

const HomePage = ({ onLogout }) => {
  const [selectedCells, setSelectedCells] = useState({});

  const handleCellClick = (rowIndex, cellType) => {
    setSelectedCells((prevState) => ({
      ...prevState,
      [rowIndex]: prevState[rowIndex] === cellType ? null : cellType,
    }));
  };

  const getCellStyle = (rowIndex, cellType) => {
    return selectedCells[rowIndex] === cellType ? "bg-green-200" : "bg-white";
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            NFL Games
          </h1>
          <p className="mt-2 text-sm text-center text-balance text-gray-700">
            A list of upcoming NFL games with team names and point spreads.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"></div>
      </div>
      <div className="mt-8 flow-root">
        <div className="overflow-x-auto pb-32">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900"
                    >
                      Away Team
                    </th>
                    <th scope="col" className="w-px"></th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      Home Team
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {teams.map((game, rowIndex) => (
                    <tr key={rowIndex}>
                      <td
                        className={`whitespace-nowrap text-center py-4 pl-4 pr-3 text-sm font-medium text-gray-900 cursor-pointer ${getCellStyle(
                          rowIndex,
                          "away"
                        )}`}
                        onClick={() => handleCellClick(rowIndex, "away")}
                      >
                        {game.away.abbreviation} (
                        {game.away.spread > 0 ? "+" : ""}
                        {game.away.spread})
                        <br />
                        <span className="text-xs text-gray-500">
                          {game.away.name}
                        </span>
                      </td>
                      <td className="w-px bg-gray-200"></td>
                      <td
                        className={`whitespace-nowrap text-center px-3 py-4 text-sm font-medium text-gray-900 cursor-pointer ${getCellStyle(
                          rowIndex,
                          "home"
                        )}`}
                        onClick={() => handleCellClick(rowIndex, "home")}
                      >
                        {game.home.abbreviation} (
                        {game.home.spread > 0 ? "+" : ""}
                        {game.home.spread})
                        <br />
                        <span className="text-xs text-gray-500">
                          {game.home.name}
                        </span>
                      </td>
                    </tr>
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

export default HomePage;
