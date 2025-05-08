import React from 'react';
import { Navigation } from './Navigation';
import { DarkModeToggle } from './DarkModeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          {/* 브랜드 정보 */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-2">
              <img src="/snap-codex-logo.png" alt="SnapCodex Logo" className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold tracking-tight">SnapCodex</span>
            </div>
            <div className="text-sm opacity-80">AI로 설계부터 수주까지 자동화</div>
          </div>
          {/* 연락처 및 소셜 */}
          <div className="flex flex-col items-center md:items-end space-y-2">
            <div className="text-sm font-semibold">문의하기: <a href="mailto:contact@snap-codex.com" className="underline hover:text-blue-200" aria-label="이메일 문의">contact@snap-codex.com</a></div>
            <div className="flex space-x-4 mt-2">
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-blue-200"><i className="fab fa-twitter text-xl" aria-hidden="true"></i></a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-200"><i className="fab fa-linkedin text-xl" aria-hidden="true"></i></a>
              <a href="https://github.com/desinsight/snap-codex-scheduler" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-blue-200"><i className="fab fa-github text-xl" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
        <div className="text-center text-xs opacity-70 py-2 border-t border-white/20">
          © 2024 SnapCodex. All rights reserved.
        </div>
      </footer>
      <DarkModeToggle />
    </div>
  );
}; 