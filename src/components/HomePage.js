import React, { useState, useEffect, useCallback } from "react";
import Modal from "./Modal";
import { Calendar, ChevronRight } from "lucide-react";
import { supabase } from "../supabaseClient";
import { currentWeek, getGamesForWeek } from "../gameData";

// Clear sessionStorage on initial load if a timestamp is older than a threshold
const THRESHOLD = 1000; // 1 second
const now = new Date().getTime();
const lastVisit = sessionStorage.getItem("lastVisit");
if (!lastVisit || now - lastVisit > THRESHOLD) {
  sessionStorage.clear();
}
sessionStorage.setItem("lastVisit", now);

const HomePage = () => {
  const [selectedPicks, setSelectedPicks] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "success",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [isFirstFetch, setIsFirstFetch] = useState(true); // State to check if it's the first fetch
  const teams = getGamesForWeek(currentWeek);

  const fetchUserData = useCallback(async () => {
    const cachedData = sessionStorage.getItem("homePageData");
    if (cachedData) {
      const data = JSON.parse(cachedData);
      setUsername(data.username);
      setIsLoading(false); // Skip showing loading spinner if data is from cache
      setIsFirstFetch(false);
      return;
    }

    setIsLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError)
        throw new Error("Error getting user: " + userError.message);
      if (!user) throw new Error("No user logged in");

      setUsername(user.email.split("@")[0]);
      setIsLoading(false);
      setIsFirstFetch(false);

      const fetchedData = {
        username: user.email.split("@")[0],
      };
      sessionStorage.setItem("homePageData", JSON.stringify(fetchedData));
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handlePickClick = (gameIndex, teamType) => {
    setSelectedPicks((prevPicks) => ({
      ...prevPicks,
      [gameIndex]: teamType,
    }));
  };

  const sendPicksToSupabase = async (picks, week) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError)
        throw new Error("Error getting user: " + userError.message);
      if (!user) throw new Error("No user logged in");

      console.log("User from Supabase:", user);
      console.log("Username:", username);

      if (!username) {
        throw new Error("Unable to determine username");
      }

      const { data: existingPicks, error: fetchError } = await supabase
        .from("user_picks")
        .select("*")
        .eq("user_id", user.id)
        .eq("week", week);

      if (fetchError)
        throw new Error("Error fetching existing picks: " + fetchError.message);

      const upsertData = {
        user_id: user.id,
        username: username,
        week: week,
        picks: picks,
      };

      console.log("Data to be upserted:", upsertData);

      if (existingPicks && existingPicks.length > 0) {
        const { data, error: updateError } = await supabase
          .from("user_picks")
          .update(upsertData)
          .eq("user_id", user.id)
          .eq("week", week);

        if (updateError)
          throw new Error("Error updating picks: " + updateError.message);
        console.log("Update result:", data);
      } else {
        const { data, error: insertError } = await supabase
          .from("user_picks")
          .insert(upsertData);

        if (insertError)
          throw new Error("Error inserting picks: " + insertError.message);
        console.log("Insert result:", data);
      }

      return true;
    } catch (error) {
      console.error("Error in sendPicksToSupabase:", error.message);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Picks submitted:", selectedPicks);

    if (Object.keys(selectedPicks).length === teams.length) {
      try {
        await sendPicksToSupabase(selectedPicks, currentWeek);
        setModalContent({
          title: "Picks Submitted Successfully",
          message: `Your picks for Week ${currentWeek} have been recorded. Good luck!`,
          type: "success",
        });
      } catch (error) {
        console.error("Detailed error:", error);
        setModalContent({
          title: "Error Submitting Picks",
          message: `There was an error submitting your picks: ${error.message}. Please try again or contact support if the issue persists.`,
          type: "error",
        });
      }
    } else {
      setModalContent({
        title: "Incomplete Picks",
        message: "Please make selections for all games before submitting.",
        type: "error",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading && isFirstFetch) {
    // Only show spinner if it's the first fetch
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
              <h1 className="text-2xl font-bold">Week {currentWeek}</h1>
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
        onClose={closeModal}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
      />
    </div>
  );
};

export default HomePage;
