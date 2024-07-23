import React, { useState } from "react";
import Modal from "./Modal";

const teams = [
  {
    home: { abbreviation: "NE", name: "New England Patriots", spread: -6.5 },
    away: { abbreviation: "KC", name: "Kansas City Chiefs", spread: 6.5 },
  },
  {
    home: { abbreviation: "TB", name: "Tampa Bay Buccaneers", spread: -3.5 },
    away: { abbreviation: "DAL", name: "Dallas Cowboys", spread: 3.5 },
  },
  // ... (keep the rest of the teams data)
];

const HomePage = () => {
  const [selectedPicks, setSelectedPicks] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "success",
  });

  const handlePickClick = (gameIndex, teamType) => {
    setSelectedPicks((prevPicks) => ({
      ...prevPicks,
      [gameIndex]: teamType,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Picks submitted:", selectedPicks);

    if (Object.keys(selectedPicks).length === teams.length) {
      setModalContent({
        title: "Picks Submitted Successfully",
        message: "Your picks have been recorded. Good luck!",
        type: "success",
      });
    } else {
      setModalContent({
        title: "Incomplete Picks",
        message: "Please make selections for all games before submitting.",
        type: "error",
      });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        This Week's Games
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {teams.map((game, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Game {index + 1}
                </h2>
              </div>
              <div className="p-4 space-y-4">
                {[game.away, game.home].map((team, teamIndex) => (
                  <div
                    key={teamIndex}
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                      selectedPicks[index] ===
                      (teamIndex === 0 ? "away" : "home")
                        ? "bg-blue-100 border-2 border-blue-500"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      handlePickClick(index, teamIndex === 0 ? "away" : "home")
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700">
                        {team.abbreviation}
                      </div>
                      <span className="font-medium">{team.name}</span>
                    </div>
                    <span
                      className={`font-semibold ${
                        team.spread > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {team.spread > 0 ? "+" : ""}
                      {team.spread}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Submit Picks
          </button>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        type={modalContent.type}
      >
        {modalContent.message}
      </Modal>
    </div>
  );
};

export default HomePage;
