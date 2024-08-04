import React, { useState } from "react";
import { XCircle, User, AtSign, CreditCard } from "lucide-react";
import { supabase } from "../supabaseClient"; // Ensure this path is correct

const SignupModal = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [venmo, setVenmo] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotification(null);
    setIsLoading(true);

    try {
      const email = `${username}@pempool-123-test-1.com`;
      // Step 1: Sign up the user
      console.log("Attempting to sign up user...");
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Error during sign up:", error);
        throw error;
      }

      console.log("User signed up successfully:", data.user);

      // Step 2: Create a profile
      if (data.user) {
        console.log("Attempting to create user profile...");
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            name,
            username,
            venmo,
            email: userEmail,
          })
          .select();

        if (profileError) {
          console.error("Error creating profile:", profileError);
          throw profileError;
        }

        console.log("Profile created successfully:", profileData);

        setIsLoading(false);
        setNotification({
          type: "success",
          message:
            "Your account has been created. Please check your email for further instructions.",
        });

        // Clear form
        setPassword("");
        setName("");
        setUsername("");
        setVenmo("");
        setUserEmail("");
      }
    } catch (error) {
      console.error("Signup process failed:", error);
      setIsLoading(false);
      setNotification({
        type: "error",
        message: `Error: ${error.message}. Please check the console for more details.`,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md mx-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Sign Up</h2>
          <button
            onClick={isLoading ? null : onClose}
            className={`text-gray-400 hover:text-white transition-colors ${
              isLoading ? "cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            <XCircle size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {notification && (
            <div
              className={`p-4 rounded-md text-sm ${
                notification.type === "success"
                  ? "bg-green-800 text-green-100"
                  : "bg-red-800 text-red-100"
              }`}
            >
              {notification.message}
            </div>
          )}
          <InputField
            id="name"
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            icon={<User className="h-5 w-5 text-gray-400" aria-hidden="true" />}
          />
          <InputField
            id="venmo"
            label="Venmo Username"
            type="text"
            value={venmo}
            onChange={(e) => setVenmo(e.target.value)}
            placeholder="johndoe"
            icon={
              <CreditCard
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            }
          />
          <InputField
            id="userEmail"
            label="Email Address"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="johndoe@example.com"
            icon={
              <AtSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
            }
          />
          <InputField
            id="username"
            label="Choose a Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="johndoe123"
            icon={
              <AtSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
            }
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<User className="h-5 w-5 text-gray-400" aria-hidden="true" />}
          />
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white transition-colors ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {isLoading ? <Spinner /> : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {icon}
      </div>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required
        autoCapitalize={id === "username" || id === "venmo" ? "off" : "words"}
        className="block w-full rounded-md bg-gray-800 border border-gray-700 text-white focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 pl-10 pr-3 py-2.5 text-base"
        placeholder={placeholder}
      />
    </div>
  </div>
);

const Spinner = () => (
  <div className="w-5 h-5 border-4 border-t-4 border-gray-200 border-t-white rounded-full animate-spin"></div>
);

export default SignupModal;
