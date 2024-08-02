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
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md mx-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Sign Up</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
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
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            icon={<Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />}
          />
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
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white transition-colors ${
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
        autoCapitalize={
          type === "email" || id === "username" || id === "venmo"
            ? "off"
            : "words"
        }
        className="block w-full rounded-md bg-gray-800 border border-gray-700 text-white focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 pl-10 pr-3 py-2.5 text-base"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default SignupModal;
