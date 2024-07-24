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

function App() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setUsername(session.user.email.split("@")[0]);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setUsername(session.user.email.split("@")[0]);
      }
    });
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Error logging out:", error.message);
  };

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
                  <Route path="/" element={<HomePage />} />
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
