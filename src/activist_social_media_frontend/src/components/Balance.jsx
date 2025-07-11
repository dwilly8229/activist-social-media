import React, { useEffect, useState } from 'react';
import { backend } from '../utils/agent';
import { useAuth } from '../utils/AuthContext';

const Balance = ({ refreshSignal }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user?.nullifier_hash) return;
      setLoading(true);
      try {
        const balance = await backend.get_balance_by_nullifier(user.nullifier_hash);
        setBalance(balance ?? 0);
      } catch (err) {
        console.error('Error fetching balance:', err);
        setBalance(0);
      }
      setLoading(false);
    };

    fetchBalance();
  }, [user?.nullifier_hash, refreshSignal]); // <-- triggers on counter change

  if (!user) return null;

  return (
    <div className="text-xs text-gray-600 dark:text-gray-300 font-mono">
      {loading ? 'Balance: ...' : `Balance: ${balance ?? 0}`}
    </div>
  );
};

export default Balance;
