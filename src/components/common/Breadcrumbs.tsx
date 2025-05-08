import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const pathMap: Record<string, string> = {
  '': '홈',
  'principles': '5대 원칙',
  'easy': 'Easy',
  'evolution': 'Evolution',
  'explainable': 'Explainable',
  'universal': 'Universal',
  'useful': 'Useful',
  'demo': '데모',
  'onboarding': '온보딩',
  'scenarios': '체험 시나리오',
  'analysis': '설계자료 분석',
  'cost-update': '공사비 업데이트',
  'concept-design': '컨셉 디자인',
  'copyright': '저작권 관리',
  'nft': 'NFT 발행',
  'about': 'About',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  let path = '';
  return (
    <nav className="text-sm text-gray-500 dark:text-gray-300 my-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center space-x-2">
        <li>
          <Link to="/" className="hover:underline text-blue-600 dark:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900" aria-label="홈" tabIndex={0}>홈</Link>
        </li>
        {segments.map((seg, idx) => {
          path += '/' + seg;
          const isLast = idx === segments.length - 1;
          return (
            <li key={path} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="font-semibold text-gray-700 dark:text-white" aria-current="page">{pathMap[seg] || seg}</span>
              ) : (
                <Link to={path} className="hover:underline text-blue-600 dark:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900" aria-label={pathMap[seg] || seg} tabIndex={0}>{pathMap[seg] || seg}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}; 