import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { Calendar, ChevronRight } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-gray-700 rounded-lg shadow-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 mr-4" />
            <div>
              <h1 className="text-2xl font-bold">Week 3</h1>
              <p className="text-gray-300">
                Make your picks for this week's games
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {teams.map((game, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-gray-700 border-gray-600 px-4 py-2 border-b">
                <h2 className="text-lg font-semibold text-gray-200 flex items-center">
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
                        ? "bg-blue-900 border-2 border-blue-500"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    onClick={() =>
                      handlePickClick(index, teamIndex === 0 ? "away" : "home")
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-600 text-gray-200 rounded-full flex items-center justify-center font-bold">
                        {team.abbreviation}
                      </div>
                      <span className="font-medium text-gray-200">
                        {team.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`font-semibold ${
                          team.spread > 0 ? "text-red-400" : "text-green-400"
                        }`}
                      >
                        {team.spread > 0 ? "+" : ""}
                        {team.spread}
                      </span>
                      <ChevronRight className="w-5 h-5 ml-2 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
          >
            Submit Picks
            <ChevronRight className="w-5 h-5 ml-2" />
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
