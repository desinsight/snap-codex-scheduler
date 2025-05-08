import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export const EasyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          to="/principles"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          원칙 목록으로 돌아가기
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <div className="text-blue-500 dark:text-blue-400 mr-4">
            <FontAwesomeIcon icon={faRocket} className="text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Easy</h1>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">직관적인 사용자 경험</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            SnapCodex는 복잡한 건축 설계 프로세스를 단순화하여 누구나 쉽게 사용할 수 있도록 설계되었습니다.
            직관적인 인터페이스와 명확한 가이드라인을 통해 전문 지식이 없어도 효율적으로 작업할 수 있습니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-3">주요 특징</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• 드래그 앤 드롭 인터페이스</li>
                <li>• 단계별 가이드</li>
                <li>• 실시간 피드백</li>
                <li>• 자동 저장 기능</li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-3">사용자 혜택</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• 빠른 학습 곡선</li>
                <li>• 실수 방지 기능</li>
                <li>• 효율적인 워크플로우</li>
                <li>• 시간 절약</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">기술적 구현</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">직관적 UI/UX</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">실시간 지원</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">50%+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">작업 시간 단축</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 