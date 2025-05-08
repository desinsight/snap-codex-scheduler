import React from 'react';
import { Link } from 'react-router-dom';
import copyrightImg from '../../assets/scenario-copyright.png';

export const ScenarioCopyright: React.FC = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-2xl font-bold text-indigo-700 mb-6">CXD 저작권 관리 및 수익화</h1>
    <ol className="list-decimal list-inside mb-8 space-y-2 text-gray-700 dark:text-gray-200">
      <li>생성된 디자인 결과물 확인</li>
      <li>"NFT로 등록" 클릭</li>
      <li>저작권 보호 상태 확인</li>
      <li>필요시 라이선스 판매/공유</li>
    </ol>
    <div className="mb-6">
      <img src={copyrightImg} alt="저작권 관리 및 수익화 예시" className="rounded-lg shadow w-full max-w-md mx-auto" />
      <p className="text-sm text-center text-gray-500 mt-2">예시: NFT 등록 및 저작권 보호 상태 UI</p>
    </div>
    <div className="bg-indigo-50 dark:bg-indigo-900 rounded-lg p-4">
      <strong>주요 UI 흐름:</strong>
      <ul className="list-disc list-inside mt-2 text-indigo-700 dark:text-indigo-200">
        <li>디자인 결과물 목록 → NFT 등록/저작권 보호 → NFT 발행 완료/상태 표시 → 라이선스 판매/공유</li>
      </ul>
    </div>
    <div className="text-center mt-10">
      <Link to="/scenarios" className="inline-block px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition">시나리오 목록으로 돌아가기</Link>
    </div>
  </div>
); 