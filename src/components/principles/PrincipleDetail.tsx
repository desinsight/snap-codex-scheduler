import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Principle } from '../../data/principles';

interface PrincipleDetailProps {
  principle: Principle;
}

export const PrincipleDetail: React.FC<PrincipleDetailProps> = ({ principle }) => {
  return (
    <div className={`slide p-12 flex flex-col bg-${principle.color}-50`}>
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className={`bg-${principle.color}-600 text-white rounded-full p-4 mr-4`}>
          <FontAwesomeIcon icon={principle.icon} className="text-3xl" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">
            {principle.name} <span className="text-2xl font-normal text-gray-500">{principle.koreanName}</span>
          </h1>
          <p className="text-lg text-gray-600 mt-2">{principle.description}</p>
        </div>
      </div>

      {/* Technical Elements */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">주요 기술 요소</h2>
        <div className="grid grid-cols-2 gap-4">
          {principle.technicalElements.map((element, index) => (
            <div key={index} className={`p-4 rounded-lg bg-${principle.color}-50`}>
              <span className="font-medium">{element}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Implementation Details */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">구현 상세</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">UI 구성</h3>
            <p className="text-gray-700">{principle.uiComponents.join(', ')}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">작동 위치</h3>
            <p className="text-gray-700">{principle.implementation}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">주요 특징</h3>
            <ul className="list-disc list-inside text-gray-700">
              {principle.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-auto">
        <a
          href="/principles"
          className={`inline-flex items-center px-4 py-2 bg-${principle.color}-600 text-white rounded-lg hover:bg-${principle.color}-700`}
        >
          <FontAwesomeIcon icon="arrow-left" className="mr-2" />
          원칙 목록으로 돌아가기
        </a>
      </div>
    </div>
  );
}; 