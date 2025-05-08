import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faPlay, faCheckCircle, faDownload, faStar } from '@fortawesome/free-solid-svg-icons';

const steps = [
  { icon: faUpload, label: '설계 파일 업로드', description: 'EDX 등 설계 파일을 업로드하세요.' },
  { icon: faPlay, label: 'AI 분석 시작', description: 'AI가 자동으로 설계 자료를 분석합니다.' },
  { icon: faCheckCircle, label: '핵심 요소 추출', description: '분석 결과(핵심 요소 리스트)를 확인하세요.' },
  { icon: faDownload, label: '결과 다운로드', description: '필요시 결과를 다운로드하거나 다음 단계로 이동하세요.' },
];

const sampleResult = [
  { title: '구조 벽체', value: '12개' },
  { title: '기둥', value: '8개' },
  { title: '슬래브', value: '5개' },
  { title: 'AI 분석 요약', value: '주요 구조물 자동 추출 및 분류 완료' },
];

const feedbacks = [
  { user: '김설계', comment: 'AI 분석이 정말 빠르고 정확해서 업무 효율이 크게 올랐어요!', rating: 5 },
  { user: '이엔지', comment: '결과물 미리보기가 직관적이고, 단계별 안내가 친절합니다.', rating: 4 },
];

export const DemoPage: React.FC = () => {
  const [step, setStep] = useState(0);
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-200 mb-6 text-center">SnapCodex 데모 체험</h1>
      {/* 단계별 가이드 */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
        {steps.map((s, idx) => (
          <div key={s.label} className={`flex flex-col items-center ${idx === step ? 'scale-110' : 'opacity-60'} transition`}>
            <button onClick={() => setStep(idx)} className={`rounded-full bg-blue-100 dark:bg-blue-900 p-4 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}>
              <FontAwesomeIcon icon={s.icon} className="text-2xl text-blue-600 dark:text-blue-300" />
            </button>
            <span className="font-semibold text-blue-700 dark:text-blue-200">{s.label}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 text-center">{s.description}</span>
          </div>
        ))}
      </div>
      {/* 실제 시나리오 흐름/결과물 미리보기 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-lg font-bold text-blue-700 dark:text-blue-200 mb-4">{steps[step].label}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{steps[step].description}</p>
        {step === 0 && (
          <div className="flex flex-col items-center">
            <input type="file" className="mb-4" disabled />
            <span className="text-sm text-gray-400">(데모에서는 파일 업로드가 비활성화되어 있습니다)</span>
          </div>
        )}
        {step === 1 && (
          <div className="flex flex-col items-center">
            <FontAwesomeIcon icon={faPlay} className="text-4xl text-blue-500 animate-pulse mb-2" />
            <span className="text-blue-600 dark:text-blue-300">AI가 설계 자료를 분석 중...</span>
          </div>
        )}
        {step === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sampleResult.map((item) => (
              <div key={item.title} className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 flex flex-col items-center">
                <span className="font-bold text-blue-700 dark:text-blue-200">{item.title}</span>
                <span className="text-lg text-gray-800 dark:text-gray-100">{item.value}</span>
              </div>
            ))}
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col items-center">
            <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition mb-2" disabled>결과 다운로드</button>
            <span className="text-sm text-gray-400">(데모에서는 다운로드가 비활성화되어 있습니다)</span>
          </div>
        )}
      </div>
      {/* 피드백/후기 섹션 */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-4">사용자 후기</h3>
        <div className="flex flex-col gap-4">
          {feedbacks.map((fb, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-300">{fb.user}</span>
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
    </div>
  );
}; 