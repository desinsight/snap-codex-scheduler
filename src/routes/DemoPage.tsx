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

const initialFeedbacks = [
  { user: '김설계', comment: 'AI 분석이 정말 빠르고 정확해서 업무 효율이 크게 올랐어요!', rating: 5 },
  { user: '이엔지', comment: '결과물 미리보기가 직관적이고, 단계별 안내가 친절합니다.', rating: 4 },
];

export const DemoPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [feedback, setFeedback] = useState({ user: '', comment: '', rating: 0 });
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setStep(1); // 업로드 후 바로 AI 분석 단계로 이동
      setTimeout(() => setStep(2), 1200); // 1.2초 후 결과 단계로 이동(모의)
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.user || !feedback.comment || feedback.rating === 0) return;
    setSubmitting(true);
    setTimeout(() => {
      setFeedbacks([{ ...feedback }, ...feedbacks]);
      setFeedback({ user: '', comment: '', rating: 0 });
      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-200 mb-6 text-center">SnapCodex 데모 체험</h1>
      {/* 단계별 가이드 */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
        {steps.map((s, idx) => (
          <div key={s.label} className={`flex flex-col items-center ${idx === step ? 'scale-110' : 'opacity-60'} transition`}>
            <button onClick={() => setStep(idx)} className={`rounded-full bg-blue-100 dark:bg-blue-900 p-4 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400`} aria-label={s.label} title={s.label}>
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
            <label htmlFor="file-upload" className="mb-2 font-semibold text-blue-700 dark:text-blue-200">설계 파일 업로드</label>
            <input id="file-upload" type="file" aria-label="설계 파일 업로드" title="설계 파일 업로드" className="mb-4" onChange={handleFileChange} />
            {fileName && <span className="text-sm text-gray-500">업로드 파일: {fileName}</span>}
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
            {sampleResult.map((item, idx) => (
              <div key={item.title} className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 flex flex-col items-center">
                {/* 예시 이미지 샘플 */}
                {idx === 0 && (
                  <img src="/demo-structure.webp" alt="구조 벽체 예시" width={120} height={80} loading="lazy" className="mb-2 rounded shadow" />
                )}
                <span className="font-bold text-blue-700 dark:text-blue-200">{item.title}</span>
                <span className="text-lg text-gray-800 dark:text-gray-100">{item.value}</span>
              </div>
            ))}
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col items-center">
            <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition mb-2" disabled aria-label="결과 다운로드" title="결과 다운로드">결과 다운로드</button>
            <span className="text-sm text-gray-400">(데모에서는 다운로드가 비활성화되어 있습니다)</span>
          </div>
        )}
      </div>
      {/* 피드백/후기 섹션 */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-4">사용자 후기</h3>
        <form className="flex flex-col gap-2 mb-6" onSubmit={handleFeedbackSubmit}>
          <div className="flex gap-2 items-center">
            <label htmlFor="feedback-user" className="sr-only">이름</label>
            <input id="feedback-user" type="text" value={feedback.user} onChange={e => setFeedback(f => ({ ...f, user: e.target.value }))} placeholder="이름" className="px-3 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-700" required aria-label="이름" />
            <label htmlFor="feedback-rating" className="sr-only">별점</label>
            <div id="feedback-rating" className="flex gap-1">
              {[1,2,3,4,5].map(r => (
                <button type="button" key={r} onClick={() => setFeedback(f => ({ ...f, rating: r }))} aria-label={`별점 ${r}점`} title={`별점 ${r}점`} className={r <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'}>
                  <FontAwesomeIcon icon={faStar} />
                </button>
              ))}
            </div>
          </div>
          <textarea value={feedback.comment} onChange={e => setFeedback(f => ({ ...f, comment: e.target.value }))} placeholder="후기 입력" className="px-3 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-700" required aria-label="후기 입력" rows={2} />
          <button type="submit" className="self-end px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60" disabled={submitting || feedback.rating === 0}>후기 등록</button>
        </form>
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