import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { backend } from '../utils/agent';

const DonationButton = ({ postId, refreshPosts }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setAmount('');
      setTimeout(() => {
        document.getElementById('donation-amount')?.focus();
      }, 50);
    }
  }, [isModalOpen]);

  const handleDonateClick = () => {
    if (!user) {
      alert('You must be logged in to donate.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmitDonation = async (e) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setLoading(true);
    try {
      const result = await backend.donate(postId, numericAmount);
      if ('Ok' in result) {
        alert(`✅ ${result.Ok}`);
        refreshPosts?.();
      } else {
        alert(`❌ ${result.Err}`);
      }
    } catch (err) {
      console.error('Donation failed:', err);
      alert('❌ Donation failed.');
    }
    setLoading(false);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleDonateClick}
        disabled={loading}
        className={`px-4 py-1 rounded-full text-xs font-semibold transition
          ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
      >
        {loading ? 'Donating...' : '💸 Donate'}
      </button>

      {isModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-bold text-center text-blue-600 dark:text-purple-400 mb-4">
              Donate to this Post
            </h2>
            <form onSubmit={handleSubmitDonation} className="space-y-4">
              <input
                id="donation-amount"
                type="number"
                min="1"
                step="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-400 transition"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 
                           text-white p-3 rounded-xl font-semibold transition"
              >
                {loading ? 'Processing...' : 'Confirm Donation'}
              </button>
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DonationButton;
