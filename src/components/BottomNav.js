import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Trophy, User } from "lucide-react";
import { DarkModeContext } from "../App";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useContext(DarkModeContext);

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 ${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow-md`}
    >
      <nav className="container mx-auto max-w-4xl flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center w-full h-full justify-center ${
              location.pathname === item.path
                ? darkMode
                  ? "text-blue-400"
                  : "text-blue-600"
                : darkMode
                ? "text-gray-400 hover:text-blue-400"
                : "text-gray-600 hover:text-blue-600"
            } transition-colors`}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
