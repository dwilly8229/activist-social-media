import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col z-0 items-center justify-center min-h-screen pt-20 overflow-hidden bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
      {/* Background blur bubbles */}
      <div className="absolute w-80 h-80 bg-pink-400 opacity-30 rounded-full filter blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-purple-500 opacity-30 rounded-full filter blur-3xl bottom-10 right-10"></div>

      {/* Card */}
      <div className="relative z-10 bg-white/20 dark:bg-gray-800/30 backdrop-blur-lg rounded-3xl p-10 max-w-xl mx-4 shadow-2xl border border-white/30">
        
        {/* Title with ICP logo */}
        <div className="flex items-center justify-center mb-6">
          <img 
            src="/IC_logo_horizontal_white.png" 
            alt="ICP Logo" 
            className="w-20 h-20 mr-3 drop-shadow-md"
          />
          <h1 className="text-5xl font-extrabold text-white drop-shadow-md">
            Activist Social
          </h1>
        </div>

        <p className="text-lg text-center text-gray-200 mb-8">
          Share your thoughts anonymously, prove ownership with zk-SNARKs, and support others through donations.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={() => navigate('/signin')}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white rounded-full shadow-lg font-semibold transition transform hover:scale-105"
          >
            🚀 Get Started
          </button>
          {isAuthenticated && (
            <button 
              onClick={() => navigate('/home')}
              className="w-full sm:w-auto px-8 py-3 bg-white/70 hover:bg-white/90 text-gray-800 rounded-full shadow-lg font-semibold transition transform hover:scale-105"
            >
              🏠 Go to Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
