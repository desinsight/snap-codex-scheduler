import React from 'react';

export const AboutPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 dark:text-blue-200 mb-6 text-center">About SnapCodex</h1>
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">개발 동기 & 산업의 문제점</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-2">
        건축 산업은 여전히 수작업, 비표준 데이터, 불투명한 견적 등 다양한 문제에 직면해 있습니다. 설계-시공-수주 전 과정에서 반복적이고 비효율적인 작업이 많으며, 데이터의 신뢰성과 투명성도 부족합니다.
      </p>
      <ul className="list-disc list-inside text-blue-600 dark:text-blue-300 mb-4">
        <li>수작업 중심의 설계/견적 프로세스</li>
        <li>데이터 표준화 및 자동화 부족</li>
        <li>비효율적 커뮤니케이션과 정보 단절</li>
        <li>저작권/데이터 소유권 불명확</li>
      </ul>
    </section>
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">SnapCodex의 미션</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-2">
        AI와 데이터, 클라우드, 블록체인 기술을 융합하여 건축 설계의 효율성과 투명성을 극대화하고, 모든 사용자가 혁신을 경험할 수 있도록 하는 것.
      </p>
    </section>
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">비전</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-2">
        글로벌 표준이 되는 AI 건축 자동화 플랫폼으로, 누구나 쉽게 접근하고 신뢰할 수 있는 생태계 구축.
      </p>
    </section>
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">SnapCodex의 해결 방안</h2>
      <ul className="list-disc list-inside text-blue-600 dark:text-blue-300 mb-4">
        <li>AI/ML 기반 설계 자동화 및 데이터 표준화</li>
        <li>클라우드 기반 실시간 협업 및 데이터 관리</li>
        <li>블록체인 기반 저작권 보호 및 투명한 이력 관리</li>
        <li>사용자 중심의 직관적 UI/UX</li>
        <li>지속적 진화와 오픈 이노베이션</li>
      </ul>
    </section>
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">핵심 가치</h2>
      <ul className="list-disc list-inside text-blue-600 dark:text-blue-300 mb-4">
        <li>Easy: 누구나 쉽게</li>
        <li>Evolution: 지속적 진화</li>
        <li>Explainable: 투명한 AI</li>
        <li>Universal: 보편적 접근성</li>
        <li>Useful: 실질적 실용성</li>
      </ul>
    </section>
  </div>
); 