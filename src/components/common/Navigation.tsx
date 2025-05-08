import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faLayerGroup, faPlay } from '@fortawesome/free-solid-svg-icons';

export const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'bg-gray-100' : '';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                SnapCodex
              </Link>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                홈
              </Link>
              
              <Link
                to="/principles"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  isActive('/principles') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
                5대 원칙
              </Link>
              
              <Link
                to="/demo"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  isActive('/demo') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                데모
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}; 