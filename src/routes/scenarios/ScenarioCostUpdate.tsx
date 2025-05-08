import React from 'react';
import { Link } from 'react-router-dom';
import costImg from '../../assets/scenario-cost-update.png';

export const ScenarioCostUpdate: React.FC = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-2xl font-bold text-purple-700 mb-6">설계 변경 시 자동 공사비 업데이트</h1>
    <ol className="list-decimal list-inside mb-8 space-y-2 text-gray-700 dark:text-gray-200">
      <li>변경된 설계 도면 업로드 또는 변경 내역 입력</li>
      <li>"변경 적용" 클릭</li>
      <li>자동으로 업데이트된 공사비/견적서 확인</li>
      <li>이전 견적과 비교, PDF 다운로드</li>
    </ol>
    <div className="mb-6">
      <img src={costImg} alt="공사비 자동 업데이트 예시" className="rounded-lg shadow w-full max-w-md mx-auto" />
      <p className="text-sm text-center text-gray-500 mt-2">예시: 변경 감지 및 자동 견적서 업데이트 화면</p>
    </div>
    <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
      <strong>주요 UI 흐름:</strong>
      <ul className="list-disc list-inside mt-2 text-purple-700 dark:text-purple-200">
        <li>설계 변경 내역 입력/업로드 → 변경 감지 알림 → 자동 견적서/비용 내역 업데이트 → 비교/이력 보기</li>
      </ul>
    </div>
    <div className="text-center mt-10">
      <Link to="/scenarios" className="inline-block px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition">시나리오 목록으로 돌아가기</Link>
    </div>
  </div>
); 