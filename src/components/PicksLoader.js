import React, { useState, useEffect } from "react";

export const PicksLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          onComplete();
          return 100;
        }
        return prevProgress + 10;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-80 border border-gray-700 transform transition-transform duration-300 ease-out scale-95">
        <div className="mb-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mr-2"></div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden w-full">
            <div
              className="h-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <p className="text-center text-gray-300 font-medium">
          Uploading picks ... {progress}%
        </p>
      </div>
    </div>
  );
};

export default PicksLoader;
