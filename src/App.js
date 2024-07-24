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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
      } else {
        setSession(session);
        if (session && session.user) {
          const fetchedUsername = session.user.email.split("@")[0];
          console.log("Setting username:", fetchedUsername);
          setUsername(fetchedUsername);
        }
      }
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed. New session:", session);
        setSession(session);
        if (session && session.user) {
          const newUsername = session.user.email.split("@")[0];
          console.log("Updating username:", newUsername);
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
