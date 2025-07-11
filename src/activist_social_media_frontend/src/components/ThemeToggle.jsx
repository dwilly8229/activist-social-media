import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
 const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });


  useEffect(() => {
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 transition"
    >
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

export default ThemeToggle;
