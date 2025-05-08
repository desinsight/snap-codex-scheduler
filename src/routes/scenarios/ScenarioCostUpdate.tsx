import React from 'react';
import { Link } from 'react-router-dom';
import costImg from '../../assets/scenario-cost-update.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const sampleResult = [
  { title: '변경 감지 항목', value: '벽체 2개, 창호 1개' },
  { title: '공사비 증감', value: '+1,200,000원' },
  { title: '업데이트 견적서', value: 'PDF 미리보기' },
  { title: 'AI 분석 요약', value: '설계 변경 자동 감지 및 견적 반영 완료' },
];

const feedbacks = [
  { user: '정현장', comment: '설계 변경 시 자동 견적 업데이트가 정말 편리합니다.', rating: 5 },
  { user: '박PM', comment: '비교 기능 덕분에 예산 관리가 쉬워졌어요.', rating: 4 },
];

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
    <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 mb-8">
      <strong>업데이트 결과 미리보기:</strong>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {sampleResult.map((item) => (
          <div key={item.title} className="bg-white dark:bg-purple-950/40 rounded-lg p-4 flex flex-col items-center">
            <span className="font-bold text-purple-700 dark:text-purple-200">{item.title}</span>
            <span className="text-lg text-gray-800 dark:text-gray-100">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
      <strong>주요 UI 흐름:</strong>
      <ul className="list-disc list-inside mt-2 text-purple-700 dark:text-purple-200">
        <li>설계 변경 내역 입력/업로드 → 변경 감지 알림 → 자동 견적서/비용 내역 업데이트 → 비교/이력 보기</li>
      </ul>
    </div>
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mt-8">
      <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-200 mb-4">사용자 후기</h3>
      <div className="flex flex-col gap-4">
        {feedbacks.map((fb, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="font-bold text-purple-600 dark:text-purple-300">{fb.user}</span>
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
      <Link to="/scenarios" className="inline-block px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition">시나리오 목록으로 돌아가기</Link>
    </div>
  </div>
); 