import React, { useContext } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { DarkModeContext } from "../App";

const Modal = ({ isOpen, onClose, title, children, type = "success" }) => {
  const { darkMode } = useContext(DarkModeContext);

  if (!isOpen) return null;

  const Icon = type === "success" ? CheckCircle : XCircle;
  const colors = darkMode
    ? type === "success"
      ? "bg-green-800 text-green-200 border-green-600"
      : "bg-red-800 text-red-200 border-red-600"
    : type === "success"
    ? "bg-green-100 text-green-900 border-green-500"
    : "bg-red-100 text-red-900 border-red-500";

  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className={`inline-block align-bottom ${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border-t-4 ${colors}`}
        >
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}
          >
            <div className="sm:flex sm:items-start">
              <div
                className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                  type === "success"
                    ? darkMode
                      ? "bg-green-800"
                      : "bg-green-100"
                    : darkMode
                    ? "bg-red-800"
                    : "bg-red-100"
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${
                    type === "success"
                      ? darkMode
                        ? "text-green-200"
                        : "text-green-600"
                      : darkMode
                      ? "text-red-200"
                      : "text-red-600"
                  }`}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className={`text-lg leading-6 font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2">
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {children}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            } px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}
          >
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm
                ${
                  type === "success"
                    ? darkMode
                      ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    : darkMode
                    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                }`}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
