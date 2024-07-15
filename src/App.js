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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    const storedUserName = localStorage.getItem("userName");
    if (loggedInStatus === "true" && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
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

  return (
    <Router>
      <div className="App">
        {!isLoggedIn ? (
          <LoginComponent onLogin={handleLogin} />
        ) : (
          <>
            <Header userName={userName} onLogout={handleLogout} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <BottomNav />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
