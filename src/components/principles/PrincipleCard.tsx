import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface PrincipleCardProps {
  id: string;
  name: string;
  koreanName: string;
  icon: IconDefinition;
  color: string;
  technicalElements: string[];
  uiComponents: string[];
  implementation: string;
  features: string[];
}

export const PrincipleCard: React.FC<PrincipleCardProps> = ({
  id,
  name,
  koreanName,
  icon,
  color,
  technicalElements,
  uiComponents,
  implementation,
  features,
}) => {
  return (
    <div className={`table-row grid grid-cols-5 gap-4 p-4 border-b border-gray-100 items-center hover:bg-${color}-50`}>
      <div className="flex items-center">
        <div className={`principle-icon bg-${color}-100 text-${color}-600`}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <span className={`font-medium text-${color}-800`}>{name}</span>
      </div>
      <div className="text-gray-700">
        {technicalElements.map((element, index) => (
          <span key={index} className={`px-2 py-1 bg-${color}-100 text-${color}-700 rounded-md text-xs mr-2`}>
            {element}
          </span>
        ))}
      </div>
      <div className="text-gray-700">{uiComponents.join(', ')}</div>
      <div className="text-gray-700">{implementation}</div>
      <div className="text-gray-600 text-sm">{features.join(', ')}</div>
    </div>
  );
}; 