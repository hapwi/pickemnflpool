import React, { useState } from "react";

const fakeTeams = [
  { id: 1, name: "New England Patriots", abbreviation: "NE" },
  { id: 2, name: "Kansas City Chiefs", abbreviation: "KC" },
  { id: 3, name: "Tampa Bay Buccaneers", abbreviation: "TB" },
  { id: 4, name: "Dallas Cowboys", abbreviation: "DAL" },
  // Add more teams here...
];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filteredTeams = fakeTeams.filter(
      (team) =>
        team.name.toLowerCase().includes(term) ||
        team.abbreviation.toLowerCase().includes(term)
    );

    setSearchResults(filteredTeams);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold mb-4">Search Teams</h1>
      <input
        type="text"
        placeholder="Search for a team..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <ul className="mt-4 space-y-2">
        {searchResults.map((team) => (
          <li
            key={team.id}
            className="bg-white p-3 rounded-md shadow hover:bg-gray-50"
          >
            <span className="font-semibold">{team.name}</span>{" "}
            <span className="text-gray-500">({team.abbreviation})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
