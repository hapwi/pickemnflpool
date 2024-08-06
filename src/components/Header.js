import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import AddToHome from "./AddToHome";

const Header = ({ userName, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef(null);

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

  const openModal = () => {
    setIsModalOpen(true);
    setIsMenuOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white shadow-md z-10">
      <div className="container mx-auto max-w-4xl px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">NFL Pick'em</h1>
        <div className="relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-md px-3 py-2 hover:bg-gray-700 transition-colors"
          >
            <span className="font-medium">{userName}</span>
            <ChevronDown size={20} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md overflow-hidden shadow-xl z-20">
              <button
                onClick={openModal}
                className="block w-full text-left px-4 py-2 text-sm text-gray-200 border-gray-600 border-b hover:bg-gray-600 transition-colors"
              >
                Get the App
              </button>
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <AddToHome isOpen={isModalOpen} onClose={closeModal} />
    </header>
  );
};

export default Header;
