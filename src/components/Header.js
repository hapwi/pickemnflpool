import React, { useState, useRef, useEffect, useContext } from "react";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { DarkModeContext } from "../App";

const Header = ({ userName, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 ${
        darkMode ? "bg-gray-800" : "bg-blue-600"
      } text-white shadow-md z-10`}
    >
      <div className="container mx-auto max-w-4xl px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">NFL Pick'em</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className={`flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-md px-3 py-2 ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-blue-700"
              } transition-colors`}
            >
              <span className="font-medium">{userName}</span>
              <ChevronDown size={20} />
            </button>

            {isMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 ${
                  darkMode ? "bg-gray-700" : "bg-white"
                } rounded-md overflow-hidden shadow-xl z-20`}
              >
                <div
                  className={`block px-4 py-2 text-sm ${
                    darkMode
                      ? "text-gray-200 border-gray-600"
                      : "text-gray-700 border-gray-200"
                  } border-b`}
                >
                  {userName}
                </div>
                <button
                  onClick={onLogout}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-600"
                      : "text-gray-700 hover:bg-gray-100"
                  } transition-colors`}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
