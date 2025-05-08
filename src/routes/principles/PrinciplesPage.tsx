import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faLightbulb, faBook, faGlobe, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const principles = [
  {
    id: 'easy',
    title: 'Easy',
    description: '누구나 쉽게 사용할 수 있는 직관적인 인터페이스',
    icon: faRocket,
    color: 'blue',
    path: '/principles/easy'
  },
  {
    id: 'evolution',
    title: 'Evolution',
    description: '지속적인 업데이트와 새로운 기능 추가',
    icon: faLightbulb,
    color: 'purple',
    path: '/principles/evolution'
  },
  {
    id: 'explainable',
    title: 'Explainable',
    description: 'AI의 의사결정 과정을 투명하게 설명',
    icon: faBook,
    color: 'green',
    path: '/principles/explainable'
  },
  {
    id: 'universal',
    title: 'Universal',
    description: '다양한 환경과 기기에서 접근 가능',
    icon: faGlobe,
    color: 'indigo',
    path: '/principles/universal'
  },
  {
    id: 'useful',
    title: 'Useful',
    description: '실제 업무에 도움이 되는 실용적인 기능',
    icon: faCheckCircle,
    color: 'pink',
    path: '/principles/useful'
  }
];

export const PrinciplesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">SnapCodex 5대 원칙</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          혁신적인 건축 자동화를 위한 핵심 가치
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {principles.map((principle) => (
          <Link
            key={principle.id}
            to={principle.path}
            className={`group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className={`text-${principle.color}-500 dark:text-${principle.color}-400 mb-4`}>
              <FontAwesomeIcon icon={principle.icon} className="text-4xl group-hover:scale-110 transition-transform" />
            </div>
            <h2 className={`text-2xl font-bold text-${principle.color}-700 dark:text-${principle.color}-300 mb-3`}>
              {principle.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {principle.description}
            </p>
            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>자세히 보기</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <FontAwesomeIcon icon={faRocket} className="mr-2" />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}; 