import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, Trophy, User } from "lucide-react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Send, label: "Picks" },
    { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 shadow-md">
      <nav className="container mx-auto max-w-4xl flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center w-full h-full justify-center ${
              location.pathname === item.path
                ? "text-blue-400"
                : "text-gray-400 hover:text-blue-400"
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
