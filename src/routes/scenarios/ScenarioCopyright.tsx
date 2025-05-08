import React from 'react';
import { Link } from 'react-router-dom';
import copyrightImg from '../../assets/scenario-copyright.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const sampleResult = [
  { title: 'NFT 등록 결과', value: '저작권 보호 상태: 활성' },
  { title: '라이선스 판매', value: '가능' },
  { title: '공유 옵션', value: '링크/QR 제공' },
  { title: 'AI 분석 요약', value: 'CXD 저작권 자동 관리 및 NFT 연동' },
];

const feedbacks = [
  { user: '이저작', comment: 'NFT 등록이 쉬워서 저작권 걱정이 사라졌어요.', rating: 5 },
  { user: '홍디자이너', comment: '라이선스 판매 기능이 실질적 수익에 도움이 됩니다.', rating: 4 },
];

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
    <div className="bg-indigo-50 dark:bg-indigo-900 rounded-lg p-4 mb-8">
      <strong>저작권/NFT 결과 미리보기:</strong>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {sampleResult.map((item) => (
          <div key={item.title} className="bg-white dark:bg-indigo-950/40 rounded-lg p-4 flex flex-col items-center">
            <span className="font-bold text-indigo-700 dark:text-indigo-200">{item.title}</span>
            <span className="text-lg text-gray-800 dark:text-gray-100">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-indigo-50 dark:bg-indigo-900 rounded-lg p-4">
      <strong>주요 UI 흐름:</strong>
      <ul className="list-disc list-inside mt-2 text-indigo-700 dark:text-indigo-200">
        <li>디자인 결과물 목록 → NFT 등록/저작권 보호 → NFT 발행 완료/상태 표시 → 라이선스 판매/공유</li>
      </ul>
    </div>
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mt-8">
      <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-200 mb-4">사용자 후기</h3>
      <div className="flex flex-col gap-4">
        {feedbacks.map((fb, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="font-bold text-indigo-600 dark:text-indigo-300">{fb.user}</span>
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
      <Link to="/scenarios" className="inline-block px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition">시나리오 목록으로 돌아가기</Link>
    </div>
  </div>
); 