import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Modal from "./Modal";
import SignupModal from "./SignupModal";

const LoginComponent = () => {
  const [identifier, setIdentifier] = useState(""); // This will be either username or email
  const [password, setPassword] = useState("");
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [isSignupVisible, setIsSignupVisible] = useState(true);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const cutoffDate = new Date("2024-09-05");
    if (currentDate >= cutoffDate) {
      setIsSignupVisible(false);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let email = identifier;
      // Check if identifier is not an email, treat it as a username
      if (!identifier.includes("@")) {
        email = `${identifier}@pempool-123-test-1.com`;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", data.user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData && profileData.username) {
          console.log(`Logged in as: ${profileData.username}`);
          setLoggedInUsername(profileData.username);
        }
      }
    } catch (error) {
      setModalContent({
        title: "Login Error",
        message: error.message,
      });
      setIsLoginModalOpen(true);
    }
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
      <div className="fixed top-16 w-full max-w-md p-6">
        <div className="mb-8">
          <h2 className="text-center text-3xl font-extrabold text-white">
            Sign in to your Pick'em account
          </h2>
        </div>
        <form
          className="bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label htmlFor="identifier" className="sr-only">
              Username
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Username"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="username"
              spellCheck="false"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              autoComplete="current-password"
            />
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
        {isSignupVisible && (
          <div className="text-center">
            <button
              onClick={openSignupModal}
              className="text-indigo-300 hover:text-indigo-400 font-medium"
            >
              Want to join the pool? Sign up
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        title={modalContent.title}
        type="error"
      >
        {modalContent.message}
      </Modal>

      <SignupModal isOpen={isSignupModalOpen} onClose={closeSignupModal} />

      {loggedInUsername && (
        <div className="text-center text-white">
          Logged in as: {loggedInUsername}
        </div>
      )}
    </div>
  );
};

export default LoginComponent;
