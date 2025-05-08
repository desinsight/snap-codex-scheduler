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
    path: '/principles/easy',
  },
  {
    id: 'evolution',
    title: 'Evolution',
    description: '지속적인 업데이트와 새로운 기능 추가',
    icon: faLightbulb,
    color: 'purple',
    path: '/principles/evolution',
  },
  {
    id: 'explainable',
    title: 'Explainable',
    description: 'AI의 의사결정 과정을 투명하게 설명',
    icon: faBook,
    color: 'green',
    path: '/principles/explainable',
  },
  {
    id: 'universal',
    title: 'Universal',
    description: '다양한 환경과 기기에서 접근 가능',
    icon: faGlobe,
    color: 'indigo',
    path: '/principles/universal',
  },
  {
    id: 'useful',
    title: 'Useful',
    description: '실제 업무에 도움이 되는 실용적인 기능',
    icon: faCheckCircle,
    color: 'pink',
    path: '/principles/useful',
  },
];

export const PrinciplesCardSection: React.FC = () => (
  <section className="w-full max-w-5xl mx-auto my-12 px-2 sm:px-4">
    <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 dark:text-blue-200 mb-8">SnapCodex 5대 원칙</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {principles.map((principle) => (
        <Link
          key={principle.id}
          to={principle.path}
          className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-${principle.color}-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900`}
          aria-label={`${principle.title} 원칙 자세히 보기`}
          tabIndex={0}
        >
          <FontAwesomeIcon icon={principle.icon} className={`text-3xl sm:text-4xl text-${principle.color}-500 dark:text-${principle.color}-300 mb-4 group-hover:scale-110 transition`} aria-hidden="true" />
          <h3 className={`text-lg sm:text-xl font-bold text-${principle.color}-700 dark:text-${principle.color}-200 mb-2`}>{principle.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-center text-sm">{principle.description}</p>
        </Link>
      ))}
    </div>
  </section>
); 