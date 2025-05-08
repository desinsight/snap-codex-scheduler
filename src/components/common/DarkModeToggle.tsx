import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

export const DarkModeToggle: React.FC = () => {
  const [dark, setDark] = React.useState(() =>
    typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <button
      aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      title={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="fixed bottom-6 right-6 z-50 rounded-full bg-white dark:bg-gray-800 shadow-lg p-3 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors hover:bg-blue-100 dark:hover:bg-gray-700"
      onClick={() => setDark((d) => !d)}
      tabIndex={0}
    >
      <FontAwesomeIcon icon={dark ? faSun : faMoon} className="text-xl text-blue-600 dark:text-yellow-300" />
    </button>
  );
}; 