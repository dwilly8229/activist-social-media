import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import ThemeToggle from './ThemeToggle';
import Balance from './Balance';

const Navbar = () => {
  const [balanceRefresh, setBalanceRefresh] = useState(0);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] 
      flex items-center justify-between px-6 py-3 
      bg-white/30 dark:bg-gray-900/30 backdrop-blur-md shadow-lg 
      border-b border-white/20 dark:border-gray-700 
      transition-colors duration-300">

      {/* Logo & Brand */}
      <div 
        className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform"
        onClick={() => navigate('/')}
      >
        <img 
          src="/IC_logo_horizontal_white.png" 
          alt="ICP Logo" 
          className="w-8 h-8 drop-shadow-md"
        />
        <span className="text-xl sm:text-2xl font-extrabold 
          bg-clip-text text-transparent 
          bg-gradient-to-r from-blue-600 to-purple-500 
          dark:from-purple-400 dark:to-pink-500">
          Activist Social
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-4 text-sm font-semibold">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `relative transition hover:scale-105 ${
              isActive
                ? 'text-blue-600 dark:text-purple-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-purple-400'
            }`
          }
        >
          Landing
        </NavLink>

        {isAuthenticated && (
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `relative transition hover:scale-105 group ${
                isActive
                  ? 'text-blue-600 dark:text-purple-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-purple-400'
              }`
            }
          >
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </NavLink>
        )}

        {!isAuthenticated ? (
          <>
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                `transition hover:scale-105 ${
                  isActive
                    ? 'text-blue-600 dark:text-purple-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-purple-400'
                }`
              }
            >
              Sign In
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `transition hover:scale-105 ${
                  isActive
                    ? 'text-blue-600 dark:text-purple-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-purple-400'
                }`
              }
            >
              Login
            </NavLink>
          </>
        ) : (
          <div className="relative group">
            <div className="flex items-center cursor-pointer select-none text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-purple-400">
              @{user?.handle}
            </div>
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-48 max-h-80 overflow-y-auto 
              bg-white dark:bg-gray-800 rounded-xl shadow-lg 
              opacity-0 translate-y-2 scale-95
              group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
              hover:opacity-100 hover:translate-y-0 hover:scale-100
              pointer-events-auto
              transition-all duration-300 origin-top
            ">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <Balance refreshSignal={balanceRefresh} />
              </div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
