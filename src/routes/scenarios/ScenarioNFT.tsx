import React from 'react';
import { Link } from 'react-router-dom';
import nftImg from '../../assets/scenario-nft.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const sampleResult = [
  { title: 'NFT 발행 상태', value: '완료' },
  { title: '블록체인 등록', value: '성공' },
  { title: 'NFT 이력', value: '3건' },
  { title: 'AI 분석 요약', value: '건축물 정보 기반 NFT 자동 발행' },
];

const feedbacks = [
  { user: '최블록', comment: 'NFT 발행이 클릭 한 번으로 끝나서 정말 간편합니다.', rating: 5 },
  { user: '박관리', comment: '이력 관리와 정보 확인이 쉬워졌어요.', rating: 4 },
];

export const ScenarioNFT: React.FC = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-2xl font-bold text-pink-700 mb-6">블록체인 기술과 건축물 NFT 발행</h1>
    <ol className="list-decimal list-inside mb-8 space-y-2 text-gray-700 dark:text-gray-200">
      <li>프로젝트/건축물 정보 입력</li>
      <li>"NFT 발행" 클릭</li>
      <li>블록체인 등록 및 NFT 발행 상태 확인</li>
      <li>발행된 NFT 이력/정보 확인</li>
    </ol>
    <div className="mb-6">
      <img src={nftImg} alt="건축물 NFT 발행 예시" className="rounded-lg shadow w-full max-w-md mx-auto" />
      <p className="text-sm text-center text-gray-500 mt-2">예시: 건축물 정보 입력 및 NFT 발행 UI</p>
    </div>
    <div className="bg-pink-50 dark:bg-pink-900 rounded-lg p-4 mb-8">
      <strong>NFT 발행 결과 미리보기:</strong>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {sampleResult.map((item) => (
          <div key={item.title} className="bg-white dark:bg-pink-950/40 rounded-lg p-4 flex flex-col items-center">
            <span className="font-bold text-pink-700 dark:text-pink-200">{item.title}</span>
            <span className="text-lg text-gray-800 dark:text-gray-100">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-pink-50 dark:bg-pink-900 rounded-lg p-4">
      <strong>주요 UI 흐름:</strong>
      <ul className="list-disc list-inside mt-2 text-pink-700 dark:text-pink-200">
        <li>프로젝트/건축물 정보 입력 → NFT 발행 요청 → 블록체인 등록 진행 → NFT 발행 완료/이력 보기</li>
      </ul>
    </div>
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mt-8">
      <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-200 mb-4">사용자 후기</h3>
      <div className="flex flex-col gap-4">
        {feedbacks.map((fb, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="font-bold text-pink-600 dark:text-pink-300">{fb.user}</span>
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
      <Link to="/scenarios" className="inline-block px-6 py-2 rounded-lg bg-pink-600 text-white font-semibold shadow hover:bg-pink-700 transition">시나리오 목록으로 돌아가기</Link>
    </div>
  </div>
); 