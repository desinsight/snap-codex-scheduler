import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export const UsefulPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          to="/principles"
          className="inline-flex items-center text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          원칙 목록으로 돌아가기
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <div className="text-pink-500 dark:text-pink-400 mr-4">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Useful</h1>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">실용성과 업무 효율</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            SnapCodex는 실제 건축 업무에 도움이 되는 실용적인 기능을 제공합니다. 반복 작업 자동화, 실시간 분석, 보고서 생성 등 현장 중심의 효율을 극대화합니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-pink-50 dark:bg-pink-900/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-300 mb-3">주요 특징</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• 반복 업무 자동화</li>
                <li>• 실시간 데이터 분석</li>
                <li>• 맞춤형 보고서 생성</li>
                <li>• 현장 피드백 반영</li>
              </ul>
            </div>
            <div className="bg-pink-50 dark:bg-pink-900/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-300 mb-3">사용자 혜택</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• 업무 효율 극대화</li>
                <li>• 오류/실수 감소</li>
                <li>• 신속한 의사결정</li>
                <li>• 현장 적용성 강화</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">기술적 구현</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-2">90%+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">업무 자동화</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-2">실시간</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">분석/보고</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-2">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">현장 피드백</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 