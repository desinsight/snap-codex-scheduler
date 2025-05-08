import React from 'react';
import { Link } from 'react-router-dom';
import analysisImg from '../../assets/scenario-analysis.png';

export const ScenarioAnalysis: React.FC = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-2xl font-bold text-blue-700 mb-6">AI 설계자료 분석 및 핵심 요소 추출</h1>
    <ol className="list-decimal list-inside mb-8 space-y-2 text-gray-700 dark:text-gray-200">
      <li>설계 파일(EDX 등) 업로드</li>
      <li>"AI 분석 시작" 버튼 클릭</li>
      <li>분석 결과(핵심 요소 리스트) 확인</li>
      <li>필요시 결과 다운로드 또는 다음 단계로 이동</li>
    </ol>
    <div className="mb-6">
      <img src={analysisImg} alt="설계자료 분석 예시" className="rounded-lg shadow w-full max-w-md mx-auto" />
      <p className="text-sm text-center text-gray-500 mt-2">예시: 설계 도면 업로드 및 AI 분석 결과 화면</p>
    </div>
    <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
      <strong>주요 UI 흐름:</strong>
      <ul className="list-disc list-inside mt-2 text-blue-700 dark:text-blue-200">
        <li>파일 업로드 → AI 분석 진행 → 핵심 요소 추출 결과 카드/리스트 → 상세 보기/다운로드</li>
      </ul>
    </div>
    <div className="text-center mt-10">
      <Link to="/scenarios" className="inline-block px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">시나리오 목록으로 돌아가기</Link>
    </div>
  </div>
); 