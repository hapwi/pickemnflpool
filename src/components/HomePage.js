import React, { useState, useEffect, useCallback } from "react";
import Modal from "./Modal";
import { ChevronRight, Loader2, Edit } from "lucide-react";
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
  const [timeRemaining, setTimeRemaining] = useState(""); // Add state for countdown timer
  const [progress, setProgress] = useState(0); // Add state for progress bar
  const teams = getGamesForWeek(currentWeek);

  const clearSessionStorage = () => {
    sessionStorage.removeItem(`leaderboardData_week_${currentWeek}`);
    sessionStorage.removeItem(`profileData_${username}`);
  };

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

  useEffect(() => {
    const weekDate = weekDates[currentWeek];
    if (!weekDate) return;

    const calculateTimeRemaining = (viewableFrom) => {
      const now = new Date();
      const targetDate = new Date(viewableFrom);
      const totalSeconds = Math.floor((targetDate - now) / 1000);

      if (totalSeconds <= 0) {
        return "00:00:00";
      }

      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
        2,
        "0"
      );
      const seconds = String(totalSeconds % 60).padStart(2, "0");

      return `${hours}:${minutes}:${seconds}`;
    };

    const calculateProgress = (availableFrom, viewableFrom) => {
      const now = new Date();
      const startDate = new Date(availableFrom);
      const endDate = new Date(viewableFrom);

      if (now >= endDate) return 100;
      if (now <= startDate) return 0;

      const totalDuration = endDate - startDate;
      const elapsed = now - startDate;

      return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    };

    const updateCountdownAndProgress = () => {
      const timeLeft = calculateTimeRemaining(weekDate.viewableFrom);
      setTimeRemaining(timeLeft);

      const progress = calculateProgress(
        weekDate.availableFrom,
        weekDate.viewableFrom
      );
      setProgress(progress);
    };

    updateCountdownAndProgress(); // Initial call to set the time immediately

    const intervalId = setInterval(updateCountdownAndProgress, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handlePickClick = (gameIndex, teamType) => {
    if (!isEditing && hasSubmittedPicks) return;
    const team =
      teamType === "away" ? teams[gameIndex].away : teams[gameIndex].home;
    setSelectedPicks((prevPicks) => ({
      ...prevPicks,
      [gameIndex]: `${team.abbreviation} (${team.spread > 0 ? "+" : ""}${
        team.spread
      })`,
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

        // Clear session storage for Leaderboard and Profile pages
        clearSessionStorage();

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
    // Clear session storage for Leaderboard and Profile pages
    clearSessionStorage();
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
            Preparing matchups for week {currentWeek + 1}
          </h1>
          <p className="text-lg">Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-lg p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-4 md:space-y-0">
          <div className="flex items-center">
            <div>
              <h1 className="text-3xl font-bold text-center md:text-left">
                Week {currentWeek}
              </h1>
              <p className="text-gray-300 text-center md:text-left">
                {hasSubmittedPicks
                  ? isEditing
                    ? "Edit your picks for this week's games"
                    : "You have already submitted your picks for this week."
                  : "Make your picks for this week's games"}
              </p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <h2 className="text-lg font-semibold">Picks Lock In:</h2>
            <p className="text-2xl font-bold text-yellow-500">
              {timeRemaining}
            </p>
          </div>
        </div>
        <div className="relative w-full h-2 bg-gray-600 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-yellow-500"
            style={{ width: `${progress}%` }}
          ></div>
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
                    {game.away.abbreviation} @ {game.home.abbreviation}
                  </h2>
                </div>
                <div className="p-4 space-y-4">
                  {[game.away, game.home].map((team, teamIndex) => (
                    <div
                      key={teamIndex}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                        selectedPicks[index] ===
                        `${team.abbreviation} (${team.spread > 0 ? "+" : ""}${
                          team.spread
                        })`
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
                        <img
                          src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/${team.abbreviation.toLowerCase()}.png&scale=crop&cquality=100&location=origin&w=40&h=40`}
                          alt={team.abbreviation}
                        />
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
          {teams.length > 0 && ( // Check if teams are available before rendering tiebreaker input
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
          )}
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
