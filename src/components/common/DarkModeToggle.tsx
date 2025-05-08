import React, { useEffect, useState } from 'react';

export const DarkModeToggle: React.FC = () => {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  return (
    <button
      aria-label={dark ? '라이트모드로 전환' : '다크모드로 전환'}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gray-200 dark:bg-gray-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      onClick={() => setDark((d) => !d)}
      tabIndex={0}
    >
      <span aria-hidden="true" className="text-2xl">{dark ? '🌙' : '☀️'}</span>
    </button>
  );
}; 