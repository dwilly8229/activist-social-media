import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { generateOwnershipProof } from '../utils/zkUtils';

const Login = () => {
  const { loginWithZk } = useAuth();
  const navigate = useNavigate();
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!secret.trim()) return alert("Please enter your secret phrase.");

    try {
      setLoading(true);
      const { nullifier_hash, proof } = await generateOwnershipProof(secret);

      if (!nullifier_hash) {
        throw new Error("Nullifier hash missing from proof output.");
      }

      const handle = prompt("Enter your handle again:", "activist123") || "activist123";
      loginWithZk({ handle, nullifier_hash, proof });

      alert(`🎉 Logged in successfully as @${handle}.`);
      navigate('/home');
    } catch (err) {
      console.error("Login failed:", err);
      alert(`❌ Login failed: ${err.message || "Check your secret phrase."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      min-h-screen flex items-center justify-center 
      px-4 
      bg-gradient-to-br from-blue-200 to-blue-400
      dark:from-black dark:via-gray-900 dark:to-purple-950
      transition-colors duration-500
    ">
      <div className="
        w-full max-w-md p-8 
        bg-white/50 dark:bg-gray-900/80 
        rounded-2xl shadow-xl 
        backdrop-blur-md 
        border border-transparent dark:border-purple-600 
        ring-1 ring-blue-300 dark:ring-purple-700
        transition-all duration-300
      ">
        <h1 className="text-2xl font-bold text-center text-blue-700 dark:text-purple-400">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4 mt-6">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter your secret phrase"
            className="
              w-full p-3 border rounded-xl 
              bg-gray-50 dark:bg-gray-800 
              text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
            "
            required
            autoFocus
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-gradient-to-r from-blue-700 to-purple-600 
              hover:from-blue-800 hover:to-purple-700 
              text-white p-3 rounded-xl font-semibold 
              transition disabled:opacity-50
            "
          >
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
