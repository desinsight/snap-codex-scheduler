import React from 'react';
import { Link } from 'react-router-dom';
import analysisImg from '../../assets/scenario-analysis.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const sampleResult = [
  { title: '핵심 구조 벽체', value: '10개' },
  { title: '기둥', value: '7개' },
  { title: '슬래브', value: '4개' },
  { title: 'AI 분석 요약', value: '주요 구조물 자동 추출 및 분류 완료' },
];

const feedbacks = [
  { user: '박AI', comment: '핵심 요소 추출 결과가 명확해서 설계 검토가 쉬워졌어요.', rating: 5 },
  { user: '최설계', comment: '분석 속도가 빨라서 반복 작업이 크게 줄었습니다.', rating: 4 },
];

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
    <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mb-8">
      <strong>분석 결과 미리보기:</strong>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {sampleResult.map((item) => (
          <div key={item.title} className="bg-white dark:bg-blue-950/40 rounded-lg p-4 flex flex-col items-center">
            <span className="font-bold text-blue-700 dark:text-blue-200">{item.title}</span>
            <span className="text-lg text-gray-800 dark:text-gray-100">{item.value}</span>
          </div>
        ))}
      </div>
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