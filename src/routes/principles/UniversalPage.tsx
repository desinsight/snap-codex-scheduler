import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export const UniversalPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          to="/principles"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          원칙 목록으로 돌아가기
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <div className="text-indigo-500 dark:text-indigo-400 mr-4">
            <FontAwesomeIcon icon={faGlobe} className="text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Universal</h1>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">보편적 접근성과 호환성</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            SnapCodex는 다양한 환경과 기기에서 누구나 쉽게 접근할 수 있도록 설계되었습니다. 클라우드 기반 서비스로 언제 어디서나, 어떤 디바이스에서도 동일한 경험을 제공합니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3">주요 특징</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• 멀티 디바이스 지원</li>
                <li>• 클라우드 기반 서비스</li>
                <li>• 표준 데이터 포맷</li>
                <li>• 글로벌 접근성</li>
              </ul>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3">사용자 혜택</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• 언제 어디서나 사용 가능</li>
                <li>• 다양한 기기 호환</li>
                <li>• 데이터 이동성 보장</li>
                <li>• 글로벌 협업 지원</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">기술적 구현</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">클라우드 호환</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">모든</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">기기 지원</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">글로벌</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">접근성</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 