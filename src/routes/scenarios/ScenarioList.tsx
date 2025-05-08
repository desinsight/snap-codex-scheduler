import React from 'react';
import { Link } from 'react-router-dom';
import { faFileAlt, faSyncAlt, faPalette, faCertificate, faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const scenarios = [
  {
    id: 'analysis',
    icon: faFileAlt,
    title: 'AI 설계자료 분석 및 핵심 요소 추출',
    description: '설계 파일을 업로드하면 AI가 자동으로 핵심 요소를 추출합니다.',
  },
  {
    id: 'cost-update',
    icon: faSyncAlt,
    title: '설계 변경 시 자동 공사비 업데이트',
    description: '설계 변경 시 공사비가 자동으로 업데이트됩니다.',
  },
  {
    id: 'concept-design',
    icon: faPalette,
    title: 'CXD 파일 기반 컨셉 디자인 자동 생성',
    description: 'CXD 파일로 다양한 컨셉 디자인을 AI가 자동 생성합니다.',
  },
  {
    id: 'copyright',
    icon: faCertificate,
    title: 'CXD 저작권 관리 및 수익화',
    description: '디자인 결과물을 NFT로 등록해 저작권 보호와 수익화가 가능합니다.',
  },
  {
    id: 'nft',
    icon: faCubes,
    title: '블록체인 기술과 건축물 NFT 발행',
    description: '건축물 정보를 NFT로 발행해 투명한 이력과 자산화를 지원합니다.',
  },
];

export const ScenarioList: React.FC = () => (
  <div className="max-w-5xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">SnapCodex 체험 시나리오</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {scenarios.map((sc) => (
        <Link
          key={sc.id}
          to={`/scenarios/${sc.id}`}
          className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition transform hover:-translate-y-2"
          aria-label={sc.title + ' 자세히 보기'}
        >
          <FontAwesomeIcon icon={sc.icon} className="text-4xl text-blue-500 dark:text-blue-300 mb-4 group-hover:scale-110 transition" aria-hidden="true" />
          <h2 className="text-lg font-bold text-blue-700 dark:text-blue-200 mb-2 text-center">{sc.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-2">{sc.description}</p>
          <span className="mt-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold text-sm group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition">자세히 보기</span>
        </Link>
      ))}
    </div>
  </div>
); 