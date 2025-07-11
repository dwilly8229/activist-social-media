import React, { useState, useEffect } from 'react';

const DonationModal = ({ isOpen, onClose, onDonate }) => {
  const [amount, setAmount] = useState('');

  useEffect(() => {
  if (isOpen) {
    setAmount('');
    setTimeout(() => {
      document.getElementById('donation-amount')?.focus();
    }, 50);
  }
}, [isOpen]);


  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }
    onDonate(numericAmount);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg transform transition-all scale-100 opacity-100 animate-fade-in-up w-full max-w-sm">
        <h2 className="text-xl font-bold text-center text-blue-600 dark:text-purple-400 mb-4">
          Donate to this Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 
                       text-white p-3 rounded-xl font-semibold transition"
          >
            Confirm Donation
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DonationModal;
