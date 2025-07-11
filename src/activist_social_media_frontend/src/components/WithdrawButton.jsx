import React, { useState } from 'react';
import { backend } from '../utils/agent';

const WithdrawButton = ({ postId, nullifierHash, proof, amount, refreshPosts, onWithdrawSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleWithdraw = async () => {
    if (!nullifierHash || !proof) {
      alert("You must be logged in with zk proof to withdraw.");
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const result = await backend.withdraw(postId, nullifierHash, JSON.stringify(proof));
      if ('Ok' in result) {
        setMessage(`✅ ${result.Ok}`);
        refreshPosts?.();
        onWithdrawSuccess?.();
      } else {
        setMessage(`❌ ${result.Err}`);
      }
    } catch (err) {
      console.error('Withdraw failed:', err);
      setMessage('❌ Withdraw failed.');
    }
    setLoading(false);
  };

  const isDisabled = loading || amount <= 0;

  return (
    <div className="flex flex-col items-center space-y-1">
      <button
        onClick={handleWithdraw}
        disabled={isDisabled}
        title={amount <= 0 ? 'Nothing to withdraw.' : ''}
        className={`px-4 py-1 rounded-full text-xs font-semibold transition
          ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
      >
        {loading ? 'Withdrawing...' : '🏦 Withdraw'}
      </button>
      {message && (
        <span className={`text-xs text-center ${message.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </span>
      )}
    </div>
  );
};

export default WithdrawButton;
