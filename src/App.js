import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginComponent from "./components/LoginComponent";
import BottomNav from "./components/BottomNav";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import LeaderboardPage from "./components/LeaderboardPage";
import ProfilePage from "./components/ProfilePage";
import ScrollToTop from "./components/ScrollToTop";

export const DarkModeContext = React.createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    const storedUserName = localStorage.getItem("userName");
    const storedDarkMode = localStorage.getItem("darkMode");
    if (loggedInStatus === "true" && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
    }
    if (storedDarkMode === "true") {
      setDarkMode(true);
    }
  }, []);

  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", (!darkMode).toString());
  };

  return (
    <Router>
      <ScrollToTop />
      <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <div
          className={`App min-h-screen flex flex-col ${
            darkMode ? "dark bg-gray-900" : "bg-gray-100"
          }`}
        >
          {!isLoggedIn ? (
            <LoginComponent onLogin={handleLogin} />
          ) : (
            <>
              <Header userName={userName} onLogout={handleLogout} />
              <main className="flex-grow pt-20 pb-20 px-4">
                <div className="container mx-auto max-w-4xl">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route
                      path="/profile"
                      element={<ProfilePage userName={userName} />}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </main>
              <BottomNav />
            </>
          )}
        </div>
      </DarkModeContext.Provider>
    </Router>
  );
}

export default App;
