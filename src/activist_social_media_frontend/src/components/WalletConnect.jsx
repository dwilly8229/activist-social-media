import React, { useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { useAuth } from '../utils/AuthContext';

const WalletConnect = () => {
  const { user, loginWithWallet, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const connectInternetIdentity = async () => {
    setLoading(true);
    const authClient = await AuthClient.create();
    await authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: () => {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toText();
        loginWithWallet(principal);
        setLoading(false);
      },
      onError: (err) => {
        console.error('II error:', err);
        setLoading(false);
      }
    });
  };

  const connectPlug = async () => {
    if (!window.ic?.plug) {
      alert("Plug wallet not found. Install it from plugwallet.ooo");
      return;
    }
    try {
      setLoading(true);
      await window.ic.plug.requestConnect();
      const principal = await window.ic.plug.agent.getPrincipal();
      loginWithWallet(principal.toText());
    } catch (err) {
      console.error('Plug connect failed:', err);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {user?.principal ? (
        <>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Connected: <span className="font-mono">{user.principal.slice(0,5)}...{user.principal.slice(-5)}</span>
          </p>
          <button
            onClick={logout}
            className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-sm hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Disconnect
          </button>
        </>
      ) : (
        <>
          <button
            onClick={connectInternetIdentity}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition"
          >
            {loading ? 'Connecting...' : 'Connect Internet Identity'}
          </button>
          <button
            onClick={connectPlug}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl transition"
          >
            {loading ? 'Connecting...' : 'Connect Plug Wallet'}
          </button>
        </>
      )}
    </div>
  );
};

export default WalletConnect;
