import React, { useState, useEffect, useCallback } from "react";
import Modal from "./Modal";
import { Calendar, ChevronRight, Loader2, Edit } from "lucide-react";
import { supabase } from "../supabaseClient";
import { currentWeek, getGamesForWeek } from "../gameData";
import { isWeekViewable, weekDates } from "./weekDates"; // Import the necessary functions

const isWeekInSubmissionPeriod = (weekNumber) => {
  const now = new Date();
  const weekDate = weekDates[weekNumber];

  return (
    weekDate &&
    now >= new Date(weekDate.availableFrom) &&
    now < new Date(weekDate.viewableFrom)
  );
};

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
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [hasSubmittedPicks, setHasSubmittedPicks] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tiebreaker, setTiebreaker] = useState(""); // Add state for tiebreaker
  const teams = getGamesForWeek(currentWeek);

  const fetchUserData = useCallback(async () => {
    const cachedData = sessionStorage.getItem("homePageData");
    if (cachedData) {
      const data = JSON.parse(cachedData);
      if (data.week === currentWeek) {
        setUsername(data.username);
        setHasSubmittedPicks(data.hasSubmittedPicks);
        setSelectedPicks(data.picks || {});
        setTiebreaker(data.tiebreaker || ""); // Add this line
        setIsLoading(false);
        setIsFirstFetch(false);
        return;
      }
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

      const username = user.email.split("@")[0];
      setUsername(username);

      // Check if the user has already submitted picks for the current week
      const { data: userPicks, error: picksError } = await supabase
        .from("user_picks")
        .select("*")
        .eq("user_id", user.id)
        .eq("week", currentWeek)
        .single();

      if (picksError && picksError.code !== "PGRST116") {
        throw new Error("Error fetching user picks: " + picksError.message);
      }

      const hasSubmitted = !!userPicks;
      setHasSubmittedPicks(hasSubmitted);
      if (hasSubmitted) {
        setSelectedPicks(userPicks.picks);
        setTiebreaker(userPicks.tiebreaker || ""); // Add this line
      } else {
        setSelectedPicks({});
        setTiebreaker(""); // Add this line
      }

      setIsLoading(false);
      setIsFirstFetch(false);

      const fetchedData = {
        username: username,
        hasSubmittedPicks: hasSubmitted,
        picks: hasSubmitted ? userPicks.picks : {},
        tiebreaker: hasSubmitted ? userPicks.tiebreaker : "", // Add this line
        week: currentWeek,
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
    if (!isEditing && hasSubmittedPicks) return;
    setSelectedPicks((prevPicks) => ({
      ...prevPicks,
      [gameIndex]: teamType,
    }));
  };

  const sendPicksToSupabase = async (picks, week, tiebreaker) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError)
        throw new Error("Error getting user: " + userError.message);
      if (!user) throw new Error("No user logged in");

      if (!username) {
        throw new Error("Unable to determine username");
      }

      const upsertData = {
        user_id: user.id,
        username: username,
        week: week,
        picks: picks,
        tiebreaker: tiebreaker,
      };

      const { error } = await supabase.from("user_picks").upsert(upsertData, {
        onConflict: "user_id,week",
        returning: "minimal",
      });

      if (error) {
        throw new Error(`Error upserting picks: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error("Error in sendPicksToSupabase:", error.message);
      throw error;
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Picks submitted:", selectedPicks);

    if (Object.keys(selectedPicks).length === teams.length) {
      try {
        await sendPicksToSupabase(selectedPicks, currentWeek, tiebreaker); // Pass tiebreaker
        setHasSubmittedPicks(true);
        setIsEditing(false);
        setModalContent({
          title: isEditing
            ? "Picks Updated Successfully"
            : "Picks Submitted Successfully",
          message: `Your picks for Week ${currentWeek} have been ${
            isEditing ? "updated" : "recorded"
          }. Good luck!`,
          type: "success",
        });

        // Update sessionStorage
        const cachedData = JSON.parse(
          sessionStorage.getItem("homePageData") || "{}"
        );
        cachedData.hasSubmittedPicks = true;
        cachedData.picks = selectedPicks;
        cachedData.tiebreaker = tiebreaker; // Add this line
        cachedData.week = currentWeek;
        sessionStorage.setItem("homePageData", JSON.stringify(cachedData));
      } catch (error) {
        console.error("Detailed error:", error);
        setModalContent({
          title: "Error Submitting Picks",
          message: `There was an error ${
            isEditing ? "updating" : "submitting"
          } your picks: ${
            error.message
          }. Please try again or contact support if the issue persists.`,
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isLoading && isFirstFetch) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
      </div>
    );
  }

  // Check if the current week is viewable or in the submission period
  const weekIsViewable = isWeekViewable(currentWeek);
  const weekInSubmissionPeriod = isWeekInSubmissionPeriod(currentWeek);

  if (!weekInSubmissionPeriod && weekIsViewable) {
    return (
      <div className="fixed inset-0 flex justify-center items-start bg-gray-900 pt-24 px-4">
        <div className="bg-gray-700 text-white p-8 rounded-lg shadow-lg text-center max-w-lg w-full mx-auto">
          <h1 className="text-3xl font-bold mb-4">
            Preparing matchups for next week
          </h1>
          <p className="text-lg">Please check back later.</p>
        </div>
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
                {hasSubmittedPicks
                  ? isEditing
                    ? "Edit your picks for this week's games"
                    : "You have already submitted your picks for this week."
                  : "Make your picks for this week's games"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {(!hasSubmittedPicks || isEditing) && (
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
                        handlePickClick(
                          index,
                          teamIndex === 0 ? "away" : "home"
                        )
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
          <div className="mb-8">
            <label htmlFor="tiebreaker" className="block text-gray-200 mb-2">
              Total Score of the Monday Game
            </label>
            <input
              type="number"
              id="tiebreaker"
              name="tiebreaker"
              value={tiebreaker}
              placeholder="42"
              onChange={(e) => setTiebreaker(e.target.value)}
              className="w-full p-3 bg-gray-800 text-gray-200 rounded-md"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
            >
              {isEditing ? "Update Picks" : "Submit Picks"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </form>
      )}

      {hasSubmittedPicks && !isEditing && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleEdit}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
          >
            Edit Picks
            <Edit className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}

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
