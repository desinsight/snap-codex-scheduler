import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane, faLayerGroup, faPlay, faUserPlus, faChartLine, faCloud, faShieldAlt, faFlask } from '@fortawesome/free-solid-svg-icons';

const features = [
  {
    icon: faRobot,
    color: 'blue',
    title: 'AI 기반 자동화',
    description: '도면 분석, 비용 산출, 보고서 생성 등 반복적인 작업을 자동화합니다.',
    link: '/feature-ai',
    aria: 'AI 기반 자동화 자세히 보기',
  },
  {
    icon: faChartLine,
    color: 'green',
    title: '실시간 분석',
    description: '프로젝트 진행 상황을 실시간으로 모니터링하고 분석합니다.',
    link: '/feature-analytics',
    aria: '실시간 분석 자세히 보기',
  },
  {
    icon: faCloud,
    color: 'purple',
    title: '클라우드 통합',
    description: '어디서나 접근 가능한 클라우드 기반 솔루션을 제공합니다.',
    link: '/feature-cloud',
    aria: '클라우드 통합 자세히 보기',
  },
  {
    icon: faShieldAlt,
    color: 'indigo',
    title: '블록체인 보호',
    description: 'NFT 기반 저작권 보호 및 수익화 기능을 지원합니다.',
    link: '/feature-blockchain',
    aria: '블록체인 보호 자세히 보기',
  },
];

export const HomePage: React.FC = () => (
  <div className="relative flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
    {/* 배경 그래픽 (애니메이션 원) */}
    <div className="absolute -top-32 -left-32 w-72 h-72 sm:w-96 sm:h-96 bg-blue-200 dark:bg-blue-900 opacity-30 rounded-full animate-pulse z-0" />
    <div className="absolute -bottom-32 -right-32 w-72 h-72 sm:w-96 sm:h-96 bg-purple-200 dark:bg-purple-900 opacity-30 rounded-full animate-pulse z-0" />
    {/* 히어로 섹션 */}
    <div className="relative z-10 flex flex-col items-center px-4 sm:px-0">
      <div className="flex items-center mb-6">
        <img src="/snap-codex-logo.png" alt="SnapCodex Logo" className="h-14 w-14 sm:h-16 sm:w-16 mr-4 drop-shadow-lg animate-bounce" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 dark:text-blue-200 tracking-tight">SnapCodex</h1>
      </div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 text-center animate-fade-in">
        AI 기반 건축 자동화 플랫폼
      </h2>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 text-center max-w-xl animate-fade-in delay-100">
        설계부터 수주까지, 혁신적인 AI 자동화 경험을 SnapCodex에서 시작하세요.
      </p>
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-10 animate-fade-in delay-200 w-full max-w-xs sm:max-w-none">
        <Link to="/demo" className="px-7 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition flex items-center text-lg justify-center" aria-label="1분만에 체험하기">
          <FontAwesomeIcon icon={faRobot} className="mr-2" aria-hidden="true" />
          1분만에 체험하기
        </Link>
        <a href="#contact" className="px-7 py-3 rounded-lg bg-white border-2 border-blue-400 text-blue-700 font-semibold shadow hover:bg-blue-50 transition flex items-center text-lg justify-center dark:bg-gray-800 dark:text-blue-200 dark:border-blue-300" aria-label="문의하기">
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2" aria-hidden="true" />
          문의하기
        </a>
      </div>
    </div>
    {/* 주요 콘텐츠 바로가기 카드 섹션 */}
    <div className="relative z-10 w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8 px-2 sm:px-4">
      {/* 5대 원칙 카드 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition group">
        <FontAwesomeIcon icon={faLayerGroup} className="text-3xl sm:text-4xl text-blue-500 dark:text-blue-300 mb-4 group-hover:scale-110 transition" aria-hidden="true" />
        <h3 className="text-lg sm:text-xl font-bold text-blue-700 dark:text-blue-200 mb-2">5대 원칙</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">SnapCodex의 핵심 가치와 기술 구현 원칙을 한눈에 확인하세요.</p>
        <Link to="/principles" className="px-5 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 transition" aria-label="5대 원칙 바로가기">5대 원칙 바로가기</Link>
      </div>
      {/* 데모 카드 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition group">
        <FontAwesomeIcon icon={faPlay} className="text-3xl sm:text-4xl text-purple-500 dark:text-purple-300 mb-4 group-hover:scale-110 transition" aria-hidden="true" />
        <h3 className="text-lg sm:text-xl font-bold text-purple-700 dark:text-purple-200 mb-2">데모 체험</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">AI 자동화 기능을 실제로 체험해보고, 업무 효율을 직접 경험해보세요.</p>
        <Link to="/demo" className="px-5 py-2 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 font-semibold hover:bg-purple-200 dark:hover:bg-purple-800 transition" aria-label="데모 바로가기">데모 바로가기</Link>
      </div>
      {/* 온보딩 카드 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition group">
        <FontAwesomeIcon icon={faUserPlus} className="text-3xl sm:text-4xl text-green-500 dark:text-green-300 mb-4 group-hover:scale-110 transition" aria-hidden="true" />
        <h3 className="text-lg sm:text-xl font-bold text-green-700 dark:text-green-200 mb-2">온보딩 시나리오</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">처음 시작하는 분들을 위한 단계별 온보딩 가이드와 실전 예시를 제공합니다.</p>
        <Link to="/onboarding" className="px-5 py-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 font-semibold hover:bg-green-200 dark:hover:bg-green-800 transition" aria-label="온보딩 바로가기">온보딩 바로가기</Link>
      </div>
    </div>
    {/* 체험 시나리오 바로가기 버튼 */}
    <div className="mb-12">
      <Link to="/scenarios" className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition text-lg" aria-label="체험 시나리오 바로가기">
        <FontAwesomeIcon icon={faFlask} className="mr-2" aria-hidden="true" />
        체험 시나리오 바로가기
      </Link>
    </div>
    {/* 주요 기능/핵심 메시지 카드 섹션 */}
    <div className="relative z-10 w-full max-w-5xl mx-auto mt-10 mb-16 px-2 sm:px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 dark:text-blue-200 mb-8 sm:mb-10">주요 기능 & 핵심 메시지</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {features.map((feature, idx) => (
          <div
            key={feature.title}
            className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition transform hover:-translate-y-2 animate-fade-in`}
            style={{ animationDelay: `${0.1 * idx}s` }}
          >
            <FontAwesomeIcon icon={feature.icon} className={`text-3xl sm:text-4xl text-${feature.color}-500 dark:text-${feature.color}-300 mb-4 group-hover:scale-110 transition`} aria-hidden="true" />
            <h3 className={`text-base sm:text-lg font-bold text-${feature.color}-700 dark:text-${feature.color}-200 mb-2`}>{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-center min-h-[48px]">{feature.description}</p>
            <a
              href={feature.link}
              className={`inline-block px-4 py-2 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900 text-${feature.color}-700 dark:text-${feature.color}-200 font-semibold hover:bg-${feature.color}-200 dark:hover:bg-${feature.color}-800 transition text-sm`}
              aria-label={feature.aria}
            >
              자세히 보기
            </a>
          </div>
        ))}
      </div>
    </div>
    {/* SnapCodex 소개 */}
    <div className="relative z-10 mt-8 text-center max-w-2xl">
      <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4">SnapCodex란?</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-2">클라우드 기반의 AI 설계 플랫폼으로, EDX 포맷의 설계 모델을 업로드하면 구조화된 데이터로 변환하고 공사비를 산출하는 시스템입니다.</p>
      <ul className="list-disc list-inside text-blue-500 dark:text-blue-300 text-left mx-auto max-w-md">
        <li>AI/ML 기반 건축설계 자동화 기술 시연</li>
        <li>투자자/고객에게 기술의 실용성과 가치 제시</li>
        <li>블록체인 기반 저작권 보호 메커니즘</li>
      </ul>
    </div>
    {/* 간단한 애니메이션 효과용 스타일 */}
    <style>{`
      @keyframes fade-in { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
      .animate-fade-in { animation: fade-in 1s ease; }
      .animate-fade-in.delay-100 { animation-delay: 0.1s; }
      .animate-fade-in.delay-200 { animation-delay: 0.2s; }
    `}</style>
  </div>
); 