import React, { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, type = "success" }) => {
  useEffect(() => {
    const handleScroll = (e) => {
      if (isOpen) {
        e.preventDefault();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.addEventListener("touchmove", handleScroll, { passive: false });
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.removeEventListener("touchmove", handleScroll);
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.removeEventListener("touchmove", handleScroll);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const Icon = type === "success" ? CheckCircle : XCircle;
  const colors =
    type === "success"
      ? "bg-green-800 text-green-200 border-green-600"
      : "bg-red-800 text-red-200 border-red-600";

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full m-4 border-t-4 ${colors}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div
              className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                type === "success" ? "bg-green-800" : "bg-red-800"
              }`}
            >
              <Icon
                className={`h-6 w-6 ${
                  type === "success" ? "text-green-200" : "text-red-200"
                }`}
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                className="text-lg leading-6 font-medium text-gray-200"
                id="modal-title"
              >
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-300">{children}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm
              ${
                type === "success"
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
              }`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
