import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export const ExplainablePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          to="/principles"
          className="inline-flex items-center text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          원칙 목록으로 돌아가기
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <div className="text-green-500 dark:text-green-400 mr-4">
            <FontAwesomeIcon icon={faBook} className="text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explainable</h1>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">투명한 AI 의사결정</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            SnapCodex는 AI의 의사결정 과정을 투명하게 공개합니다. 사용자는 결과의 근거와 과정을 쉽게 이해할 수 있으며, 신뢰할 수 있는 자동화 경험을 제공합니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3">주요 특징</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• AI 의사결정 과정 시각화</li>
                <li>• 결과 근거 제공</li>
                <li>• 상세 리포트/로그</li>
                <li>• 사용자 맞춤 설명</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3">사용자 혜택</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• 신뢰성 향상</li>
                <li>• 결과 해석 용이</li>
                <li>• 투명한 업무 프로세스</li>
                <li>• 오류/이슈 빠른 파악</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">기술적 구현</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">의사결정 시각화</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">실시간</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">리포트 제공</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">맞춤형</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">설명 기능</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 