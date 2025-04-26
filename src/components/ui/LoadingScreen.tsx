import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

/**
 * A full-screen loading component
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="w-16 h-16 border-t-4 border-b-4 border-primary-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-700">{message}</p>
    </div>
  );
};

export default LoadingScreen;
