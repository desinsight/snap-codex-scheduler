import React from "react";

export default function SnapCodexLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 px-8 py-20 text-gray-900">
      {/* Intro Section */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">SnapCodex</h1>
        <p className="text-xl text-gray-600 mb-8">
          AI로 설계부터 수주까지 자동화하는 건축 솔루션
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-md transition">
          체험하기
        </button>
      </div>

      {/* Feature Cards */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <FeatureCard title="자동화된 지식 응답" desc="프롬프트와 응답이 연결되는 코드 워크플로우" />
        <FeatureCard title="실시간 Slack 연동" desc="프롬프트 변경 시 Slack으로 실시간 알림" />
        <FeatureCard title="과거 문서 연결 기능" desc="과거 유사 사례와 문서 기록 자동 연계" />
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
} 