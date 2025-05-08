import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export const EvolutionPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          to="/principles"
          className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          원칙 목록으로 돌아가기
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <div className="text-purple-500 dark:text-purple-400 mr-4">
            <FontAwesomeIcon icon={faLightbulb} className="text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Evolution</h1>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">지속적인 진화와 혁신</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            SnapCodex는 최신 기술 트렌드와 사용자 피드백을 반영하여 지속적으로 진화합니다. 새로운 기능과 개선 사항을 빠르게 도입하여, 항상 최고의 경험을 제공합니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3">주요 특징</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• 정기적 업데이트 및 패치</li>
                <li>• 사용자 피드백 기반 개선</li>
                <li>• 최신 AI/IT 기술 도입</li>
                <li>• 오픈 이노베이션</li>
              </ul>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3">사용자 혜택</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• 항상 최신 기능 사용</li>
                <li>• 빠른 버그 수정</li>
                <li>• 커뮤니티와의 소통 강화</li>
                <li>• 미래지향적 플랫폼 경험</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">기술적 구현</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">매월</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">정기 업데이트</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">100+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">피드백 반영</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">최신</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">AI/IT 기술</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 