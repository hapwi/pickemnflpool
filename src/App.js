import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { supabase } from "./supabaseClient";
import LoginComponent from "./components/LoginComponent";
import BottomNav from "./components/BottomNav";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import LeaderboardPage from "./components/LeaderboardPage";
import ProfilePage from "./components/ProfilePage";
import ScrollToTop from "./components/ScrollToTop";

const REFRESH_THRESHOLD = 120 * 60 * 1000; // 2 hours in milliseconds

function App() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(sessionData.session);
        if (sessionData.session && sessionData.session.user) {
          const fetchedUsername = sessionData.session.user.email.split("@")[0];
          setUsername(fetchedUsername);
        }
      } catch (error) {
        console.error("Error fetching session:", error.message);
        setSession(null); // Clear session in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, sessionData) => {
        setSession(sessionData);
        if (sessionData && sessionData.user) {
          const newUsername = sessionData.user.email.split("@")[0];
          setUsername(newUsername);
        } else {
          setUsername("");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const initializeTimes = () => {
      const startTime = localStorage.getItem("startTime") || Date.now();
      localStorage.setItem("startTime", startTime);
      localStorage.setItem("lastVisit", Date.now());
      console.log("Initial start time:", startTime);
      console.log("Initial last visit time:", Date.now());
    };

    initializeTimes();

    const updateLastVisit = () => {
      localStorage.setItem("lastVisit", Date.now());
    };

    const checkRefresh = () => {
      const currentTime = Date.now();
      const startTime = parseInt(localStorage.getItem("startTime"), 10);
      const elapsedTime = currentTime - startTime;
      console.log("Elapsed time:", elapsedTime);
      if (elapsedTime >= REFRESH_THRESHOLD) {
        refreshData();
        localStorage.setItem("startTime", currentTime);
        console.log("Data refreshed. New start time:", currentTime);
      }
      updateLastVisit();
    };

    checkRefresh(); // Check once on load

    const interval = setInterval(checkRefresh, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    // Your data refresh logic here
    console.log("Data refreshed!");
    // Refresh the page to ensure all data is up-to-date
    window.location.reload();
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Error logging out:", error.message);
    setUsername("");
  };

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="App min-h-screen flex flex-col bg-gray-900">
        {!session ? (
          <LoginComponent />
        ) : (
          <>
            <Header userName={username} onLogout={handleLogout} />
            <main className="flex-grow pt-20 pb-20 px-4">
              <div className="container mx-auto max-w-4xl">
                <Routes>
                  <Route
                    path="/"
                    element={
                      username ? (
                        <HomePage username={username} />
                      ) : (
                        <div>Error: Username not available</div>
                      )
                    }
                  />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route
                    path="/profile"
                    element={
                      <ProfilePage
                        userId={session.user.id}
                        userName={username}
                      />
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
            <BottomNav />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
