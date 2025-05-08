import React from 'react';
import { Link } from 'react-router-dom';
import conceptImg from '../../assets/scenario-concept-design.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const sampleResult = [
  { title: 'AI 생성 디자인 썸네일', value: '3종 미리보기' },
  { title: '선택/피드백', value: '디자인별 선택 및 의견 입력' },
  { title: '최종 디자인', value: '다운로드 가능' },
  { title: 'AI 분석 요약', value: 'CXD 기반 컨셉 디자인 자동 생성' },
];

const feedbacks = [
  { user: '디자인팀', comment: '여러 디자인을 한 번에 비교할 수 있어 의사결정이 빨라졌어요.', rating: 5 },
  { user: '김기획', comment: 'AI가 제안하는 컨셉이 신선하고 다양합니다.', rating: 4 },
];

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
    <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 mb-8">
      <strong>디자인 결과 미리보기:</strong>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {sampleResult.map((item) => (
          <div key={item.title} className="bg-white dark:bg-green-950/40 rounded-lg p-4 flex flex-col items-center">
            <span className="font-bold text-green-700 dark:text-green-200">{item.title}</span>
            <span className="text-lg text-gray-800 dark:text-gray-100">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
      <strong>주요 UI 흐름:</strong>
      <ul className="list-disc list-inside mt-2 text-green-700 dark:text-green-200">
        <li>CXD 파일 업로드 → AI 컨셉 디자인 생성 → 여러 디자인 썸네일/슬라이더 → 선택/피드백/재생성</li>
      </ul>
    </div>
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mt-8">
      <h3 className="text-lg font-semibold text-green-700 dark:text-green-200 mb-4">사용자 후기</h3>
      <div className="flex flex-col gap-4">
        {feedbacks.map((fb, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="font-bold text-green-600 dark:text-green-300">{fb.user}</span>
            <span className="flex gap-1">
              {[...Array(fb.rating)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />
              ))}
            </span>
            <span className="text-gray-700 dark:text-gray-200">{fb.comment}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="text-center mt-10">
      <Link to="/scenarios" className="inline-block px-6 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition">시나리오 목록으로 돌아가기</Link>
    </div>
  </div>
); 