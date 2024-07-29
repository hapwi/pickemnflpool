import React, { useState } from "react";
import { XCircle, Mail, User, AtSign, CreditCard } from "lucide-react";

const SignupModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [venmo, setVenmo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotification(null);
    setIsLoading(true);

    const data = new FormData();
    data.append("email", email);
    data.append("name", name);
    data.append("username", username);
    data.append("venmo", venmo);

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwy5nMW2KzUEuJOtfjh7DjfA-lExOvrWGrEa3EY6jO_ScJP7XCLRSdUsUPXF5yKE-Ntnw/exec",
        {
          method: "POST",
          body: data,
        }
      );

      const responseJson = await response.json();
      setIsLoading(false);

      const rowNumber = parseInt(responseJson.row) - 1;
      setNotification({
        type: "success",
        message: `Your submission ID: ${rowNumber}. You will receive your account details shortly.`,
      });

      // Clear form
      setEmail("");
      setName("");
      setUsername("");
      setVenmo("");
    } catch (error) {
      setIsLoading(false);
      setNotification({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="flex justify-between items-center p-8 border-b border-gray-800">
          <h2 className="text-3xl font-bold text-white">Sign Up</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XCircle size={32} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {notification && (
            <div
              className={`p-4 rounded-lg ${
                notification.type === "success"
                  ? "bg-green-800 text-green-100"
                  : "bg-red-800 text-red-100"
              }`}
            >
              {notification.message}
            </div>
          )}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-300"
            >
              Email
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-lg bg-gray-800 border-2 border-gray-700 text-white focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 pl-10 pr-4 py-3 text-lg"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-300"
            >
              Name
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full rounded-lg bg-gray-800 border-2 border-gray-700 text-white focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 pl-10 pr-4 py-3 text-lg"
                placeholder="John Doe"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-lg font-medium text-gray-300"
            >
              Username
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <AtSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full rounded-lg bg-gray-800 border-2 border-gray-700 text-white focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 pl-10 pr-4 py-3 text-lg"
                placeholder="johndoe123"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="venmo"
              className="block text-lg font-medium text-gray-300"
            >
              Venmo Username
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <CreditCard
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                id="venmo"
                value={venmo}
                onChange={(e) => setVenmo(e.target.value)}
                required
                className="block w-full rounded-lg bg-gray-800 border-2 border-gray-700 text-white focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 pl-10 pr-4 py-3 text-lg"
                placeholder="johndoe"
              />
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white transition-colors ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;