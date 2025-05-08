import React from 'react';
import { TechnicalTable } from '../../components/principles/TechnicalTable';

export const PrinciplesPage: React.FC = () => {
  return (
    <div className="slide p-12 flex flex-col">
      {/* Header */}
      <div className="rainbow-border bg-white shadow-md p-6 rounded-lg mb-8">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-4">
            <i className="fas fa-layer-group text-4xl text-gray-700"></i>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">SnapCodex 5대 원칙</h1>
            <p className="text-lg text-gray-600">기술 구현 요약</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <TechnicalTable />
      
      {/* Footer Note */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        각 원칙은 특정 영역뿐 아니라 SnapCodex 전체 아키텍처에 깊이 통합되어 있습니다
      </div>
    </div>
  );
}; 