import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Trophy, User } from "lucide-react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white">
      <nav className="flex justify-around items-center h-16">
        <button
          onClick={() => navigate("/")}
          className={`flex flex-col items-center w-full ${
            location.pathname === "/" ? "text-blue-500" : "text-gray-400"
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => navigate("/leaderboard")}
          className={`flex flex-col items-center w-full ${
            location.pathname === "/leaderboard"
              ? "text-blue-500"
              : "text-gray-400"
          }`}
        >
          <Trophy size={24} />
          <span className="text-xs mt-1">Leaderboard</span>
        </button>
        <button
          onClick={() => navigate("/profile")}
          className={`flex flex-col items-center w-full ${
            location.pathname === "/profile" ? "text-blue-500" : "text-gray-400"
          }`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default BottomNav;
