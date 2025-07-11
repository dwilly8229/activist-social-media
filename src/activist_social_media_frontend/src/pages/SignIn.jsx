import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { backend } from '../utils/agent';
import WalletConnect from '../components/WalletConnect';
import { Principal } from '@dfinity/principal';

const Signin = () => {
  const { user, loginWithZk } = useAuth();
  const navigate = useNavigate();

  const [hasNft, setHasNft] = useState(false);
  const [handle, setHandle] = useState('');
  const [secretPhrase, setSecretPhrase] = useState('');
  const [loading, setLoading] = useState(false);

  const checkNft = async () => {
    if (!user || user.type !== 'wallet') {
      return alert("Connect a wallet first.");
    }
    setLoading(true);
    try {
      const owns = await backend.check_user_has_nft(
        Principal.fromText(user.principal)
      );
      setHasNft(owns);
      if (owns) alert("✅ You already own a reputation NFT!");
    } catch (err) {
      console.error("Check NFT failed:", err);
    }
    setLoading(false);
  };

  const mintNft = async () => {
    if (!user || user.type !== 'wallet') {
      return alert("Connect a wallet first.");
    }
    setLoading(true);
    try {
      const result = await backend.mint_nft(
        Principal.fromText(user.principal)
      );
      if ('Ok' in result) {
        alert(`✅ NFT Minted: ${result.Ok}`);
        setHasNft(true);
      } else {
        alert(`❌ Mint failed: ${result.Err}`);
      }
    } catch (err) {
      console.error("Mint NFT failed:", err);
    }
    setLoading(false);
  };

  const generateZkIdentity = () => {
    if (!handle.trim()) {
      return alert("Please enter a handle.");
    }
    const phrase = Math.random().toString(36).substring(2, 15)
      + Math.random().toString(36).substring(2, 15);
    setSecretPhrase(phrase);
  };

  const finalizeSignup = () => {
    const nullifier_hash = "mock_nullifier_" + Date.now();
    const proof = ["proof1", "proof2"];
    loginWithZk({ handle, nullifier_hash, proof });
    navigate('/home');
  };

  return (
    <div className="
      min-h-screen flex items-center justify-center 
      px-4 
      bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 
      dark:from-black dark:via-blue-950 dark:to-purple-950
      transition-colors duration-500
    ">
      <div className="
        w-full max-w-md 
        p-8 
        bg-white/50 dark:bg-gray-900/80 
        shadow-xl rounded-2xl 
        border border-blue-100 dark:border-blue-900 
        backdrop-blur-md 
        ring-2 ring-blue-200 dark:ring-blue-800
        space-y-6
      ">
        <h1 className="text-2xl font-bold text-center 
          text-gray-800 dark:text-purple-400">
          Sign In
        </h1>

        <WalletConnect />

        {user?.type === 'wallet' && !hasNft && (
          <>
            <button
              onClick={checkNft}
              className="w-full bg-green-600 hover:bg-green-700 
                text-white py-2 rounded-xl transition"
            >
              Check Reputation NFT
            </button>

            <button
              onClick={mintNft}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 
                text-white py-2 rounded-xl transition mt-2"
            >
              {loading ? 'Minting...' : 'Get Reputation NFT'}
            </button>
          </>
        )}

        {hasNft && (
          <>
            <input
              type="text"
              placeholder="Choose a handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full p-3 border rounded-xl 
                bg-gray-50 dark:bg-gray-800 
                text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              onClick={generateZkIdentity}
              className="w-full bg-green-600 hover:bg-green-700 
                text-white py-2 rounded-xl transition mt-2"
            >
              Generate Secret Phrase
            </button>
          </>
        )}

        {secretPhrase && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Your secret phrase:
            </p>
            <div className="font-mono text-sm 
              text-blue-600 dark:text-purple-400 break-all">
              {secretPhrase}
            </div>
            <button
              onClick={finalizeSignup}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 
                text-white py-2 rounded-xl transition"
            >
              Complete Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signin;
