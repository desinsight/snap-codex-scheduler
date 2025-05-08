import React from 'react';
import { PrincipleCard } from './PrincipleCard';
import { principles } from '../../data/principles';

export const TechnicalTable: React.FC = () => {
  return (
    <div className="table-container bg-white flex-grow">
      {/* Table Header */}
      <div className="table-header grid grid-cols-5 gap-4 p-4 text-center font-bold">
        <div>원칙</div>
        <div>주요 기술 요소</div>
        <div>UI 구성</div>
        <div>작동 위치</div>
        <div>특징</div>
      </div>
      
      {/* Principle Rows */}
      {principles.map((principle) => (
        <PrincipleCard
          key={principle.id}
          {...principle}
        />
      ))}
    </div>
  );
}; 