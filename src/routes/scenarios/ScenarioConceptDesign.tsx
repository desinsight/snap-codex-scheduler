import React from 'react';
import { Link } from 'react-router-dom';
import conceptImg from '../../assets/scenario-concept-design.png';

export const ScenarioConceptDesign: React.FC = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-2xl font-bold text-green-700 mb-6">CXD 파일 기반 컨셉 디자인 자동 생성</h1>
    <ol className="list-decimal list-inside mb-8 space-y-2 text-gray-700 dark:text-gray-200">
      <li>CXD 파일 업로드</li>
      <li>"컨셉 디자인 생성" 클릭</li>
      <li>여러 디자인 썸네일 중 선택 또는 피드백 입력</li>
      <li>최종 디자인 확정 및 다운로드</li>
    </ol>
    <div className="mb-6">
      <img src={conceptImg} alt="컨셉 디자인 자동 생성 예시" className="rounded-lg shadow w-full max-w-md mx-auto" />
      <p className="text-sm text-center text-gray-500 mt-2">예시: 다양한 컨셉 디자인 썸네일 및 선택 UI</p>
    </div>
    <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
      <strong>주요 UI 흐름:</strong>
      <ul className="list-disc list-inside mt-2 text-green-700 dark:text-green-200">
        <li>CXD 파일 업로드 → AI 컨셉 디자인 생성 → 여러 디자인 썸네일/슬라이더 → 선택/피드백/재생성</li>
      </ul>
    </div>
    <div className="text-center mt-10">
      <Link to="/scenarios" className="inline-block px-6 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition">시나리오 목록으로 돌아가기</Link>
    </div>
  </div>
); 