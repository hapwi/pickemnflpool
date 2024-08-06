import React from "react";
import IosShareIcon from "@mui/icons-material/IosShare";

const AddToHome = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Prevent page scroll when modal is open
  document.body.style.overflow = "hidden";

  const handleClose = () => {
    document.body.style.overflow = "auto"; // Restore page scroll
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30 backdrop-blur-md">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-80 text-white">
        <div className="flex flex-col items-center">
          <img
            src="/logo192.png"
            alt="App Icon"
            className="w-16 h-16 mb-4 rounded-lg"
          />
          <h2 className="text-xl font-bold mb-4">Get the App</h2>
          <p className="text-center mb-4">
            Add our app to your home screen for quick and easy access.
          </p>
          <div className="flex flex-col items-center mb-4">
            <p className="text-center mb-2">
              <strong>Step 1:</strong> Tap the share button below.
            </p>
            <IosShareIcon
              className="text-blue-300 mb-2"
              style={{
                fontSize: "2em",
                verticalAlign: "middle",
                margin: "0 0.2em",
              }}
            />
            <p className="text-center mb-2 mt-4">
              <strong>Step 2:</strong> Select{" "}
              <strong>Add to Home Screen</strong>.
            </p>
          </div>
          <p className="text-center mb-4">
            No download required. The website will function like a standalone
            app.
          </p>
          <button
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToHome;
