import React from 'react';
import { useNavigate } from 'react-router-dom';

const principleNodes = [
  { id: 'easy', label: 'Easy', color: '#3B82F6', path: '/principles/easy' },
  { id: 'evolution', label: 'Evolution', color: '#8B5CF6', path: '/principles/evolution' },
  { id: 'explainable', label: 'Explainable', color: '#22C55E', path: '/principles/explainable' },
  { id: 'universal', label: 'Universal', color: '#6366F1', path: '/principles/universal' },
  { id: 'useful', label: 'Useful', color: '#EC4899', path: '/principles/useful' },
];

export const PrinciplesFlowChart: React.FC = () => {
  const navigate = useNavigate();
  // 원형 배치 좌표 계산
  const center = 120;
  const radius = 90;
  const angleStep = (2 * Math.PI) / principleNodes.length;

  return (
    <section className="w-full flex flex-col items-center my-8">
      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-4">5대 원칙의 유기적 연결</h3>
      <svg width={240} height={240} viewBox="0 0 240 240" className="mb-4">
        {/* 연결선 */}
        {principleNodes.map((node, i) => {
          const next = principleNodes[(i + 1) % principleNodes.length];
          const x1 = center + radius * Math.cos(angleStep * i - Math.PI / 2);
          const y1 = center + radius * Math.sin(angleStep * i - Math.PI / 2);
          const x2 = center + radius * Math.cos(angleStep * (i + 1) - Math.PI / 2);
          const y2 = center + radius * Math.sin(angleStep * (i + 1) - Math.PI / 2);
          return (
            <line key={node.id + '-line'} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#CBD5E1" strokeWidth={3} />
          );
        })}
        {/* 노드 */}
        {principleNodes.map((node, i) => {
          const x = center + radius * Math.cos(angleStep * i - Math.PI / 2);
          const y = center + radius * Math.sin(angleStep * i - Math.PI / 2);
          return (
            <g key={node.id} style={{ cursor: 'pointer' }} onClick={() => navigate(node.path)}>
              <circle cx={x} cy={y} r={28} fill={node.color} stroke="#fff" strokeWidth={3} />
              <text x={x} y={y + 5} textAnchor="middle" fontSize={15} fill="#fff" fontWeight="bold">{node.label}</text>
            </g>
          );
        })}
      </svg>
      <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
        SnapCodex의 5대 원칙은 각각 독립적이면서도 서로 유기적으로 연결되어, 혁신적인 건축 자동화 경험을 완성합니다.
      </p>
    </section>
  );
}; 