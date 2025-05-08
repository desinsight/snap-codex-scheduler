import React from 'react';
import { Link } from 'react-router-dom';
import nftImg from '../../assets/scenario-nft.png';

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
    <div className="bg-pink-50 dark:bg-pink-900 rounded-lg p-4">
      <strong>주요 UI 흐름:</strong>
      <ul className="list-disc list-inside mt-2 text-pink-700 dark:text-pink-200">
        <li>프로젝트/건축물 정보 입력 → NFT 발행 요청 → 블록체인 등록 진행 → NFT 발행 완료/이력 보기</li>
      </ul>
    </div>
    <div className="text-center mt-10">
      <Link to="/scenarios" className="inline-block px-6 py-2 rounded-lg bg-pink-600 text-white font-semibold shadow hover:bg-pink-700 transition">시나리오 목록으로 돌아가기</Link>
    </div>
  </div>
); 