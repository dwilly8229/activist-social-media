import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('zk_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const loginWithWallet = (principal) => {
    const userData = {
      type: 'wallet',
      principal
    };
    setUser(userData);
    localStorage.setItem('zk_user', JSON.stringify(userData));
  };

  const loginWithZk = ({ handle, nullifier_hash, proof }) => {
    const userData = {
      type: 'zk',
      handle,
      nullifier_hash,
      proof
    };
    setUser(userData);
    localStorage.setItem('zk_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zk_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loginWithWallet,
      loginWithZk,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
