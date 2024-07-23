import React from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const Alert = ({ message, type, onClose }) => {
  const colors = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
  };

  const Icon = type === "success" ? CheckCircle : XCircle;

  return (
    <div
      className={`rounded-md p-4 border ${colors[type]} flex items-center justify-between`}
    >
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-3" aria-hidden="true" />
        <span className="font-medium">{message}</span>
      </div>
      <button
        type="button"
        className="inline-flex rounded-md bg-transparent text-current hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
        onClick={onClose}
      >
        <span className="sr-only">Dismiss</span>
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
};

export default Alert;
