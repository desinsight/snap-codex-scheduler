import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <h1 className="text-5xl font-bold text-blue-700 dark:text-blue-300 mb-4">404</h1>
    <p className="text-lg text-gray-700 dark:text-gray-200 mb-8">페이지를 찾을 수 없습니다.</p>
    <Link to="/" className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition" aria-label="홈으로 돌아가기" title="홈으로 돌아가기">
      홈으로 돌아가기
    </Link>
  </div>
); 