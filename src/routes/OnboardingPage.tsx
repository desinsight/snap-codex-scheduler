import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
  {
    title: '1. 계정 생성 및 초기 설정',
    description: '이메일 인증 후 SnapCodex 계정을 생성하고, 기본 정보를 입력합니다.',
    principle: 'Easy',
    color: 'amber',
  },
  {
    title: '2. 5대 원칙 소개',
    description: '온보딩 과정에서 SnapCodex의 5대 원칙(Explainable, Universal, Evolution, Useful, Easy)을 간단히 안내합니다.',
    principle: 'Universal',
    color: 'indigo',
  },
  {
    title: '3. 환경 설정 및 첫 프로젝트 생성',
    description: '팀 환경을 설정하고, 첫 프로젝트를 생성합니다.',
    principle: 'Evolution',
    color: 'purple',
  },
  {
    title: '4. 첫 자동화 실행',
    description: 'AI 기반 자동화 기능을 직접 체험하며, 실제 업무에 적용해봅니다.',
    principle: 'Useful',
    color: 'green',
  },
  {
    title: '5. 피드백 및 개선 요청',
    description: '온보딩 후 피드백을 남기고, 개선 요청을 제출할 수 있습니다.',
    principle: 'Explainable',
    color: 'blue',
  },
];

export const OnboardingPage: React.FC = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">SnapCodex 온보딩 시나리오</h1>
    <ol className="space-y-8">
      {steps.map((step, idx) => (
        <li key={idx} className={`rounded-lg shadow p-6 bg-${step.color}-50 border-l-8 border-${step.color}-400`}>
          <div className="flex items-center mb-2">
            <span className={`inline-block w-8 h-8 rounded-full bg-${step.color}-400 text-white flex items-center justify-center font-bold mr-4`}>{idx + 1}</span>
            <span className={`text-xl font-semibold text-${step.color}-700`}>{step.title}</span>
          </div>
          <div className="text-gray-700 mb-1">{step.description}</div>
          <div className={`text-xs font-bold text-${step.color}-600`}>관련 원칙: {step.principle}</div>
        </li>
      ))}
    </ol>
    <div className="mt-12 text-center">
      <Link to="/" className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">홈으로 돌아가기</Link>
    </div>
  </div>
); 