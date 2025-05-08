import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import costImg from '../../assets/scenario-cost-update.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUpload, faPlay, faCheckCircle, faDownload } from '@fortawesome/free-solid-svg-icons';

const steps = [
  { icon: faUpload, label: '설계 변경 파일 업로드', description: '변경된 설계 도면을 업로드하거나 변경 내역을 입력하세요.' },
  { icon: faPlay, label: '변경 적용', description: 'AI가 변경 내역을 자동 감지하고 견적을 업데이트합니다.' },
  { icon: faCheckCircle, label: '업데이트 결과 확인', description: '자동으로 업데이트된 공사비/견적서를 확인하세요.' },
  { icon: faDownload, label: 'PDF 다운로드', description: '이전 견적과 비교, PDF로 다운로드하세요.' },
];

const sampleResult = [
  { title: '변경 감지 항목', value: '벽체 2개, 창호 1개' },
  { title: '공사비 증감', value: '+1,200,000원' },
  { title: '업데이트 견적서', value: 'PDF 미리보기' },
  { title: 'AI 분석 요약', value: '설계 변경 자동 감지 및 견적 반영 완료' },
];

const initialFeedbacks = [
  { user: '정현장', comment: '설계 변경 시 자동 견적 업데이트가 정말 편리합니다.', rating: 5 },
  { user: '박PM', comment: '비교 기능 덕분에 예산 관리가 쉬워졌어요.', rating: 4 },
];

export const ScenarioCostUpdate: React.FC = () => {
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [feedback, setFeedback] = useState({ user: '', comment: '', rating: 0 });
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setStep(1);
      setTimeout(() => setStep(2), 1200);
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
      <h1 className="text-2xl font-bold text-purple-700 mb-6">설계 변경 시 자동 공사비 업데이트</h1>
      {/* 단계별 가이드 */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
        {steps.map((s, idx) => (
          <div key={s.label} className={`flex flex-col items-center ${idx === step ? 'scale-110' : 'opacity-60'} transition`}>
            <button onClick={() => setStep(idx)} className={`rounded-full bg-purple-100 dark:bg-purple-900 p-4 mb-2 focus:outline-none focus:ring-2 focus:ring-purple-400`} aria-label={s.label} title={s.label}>
              <FontAwesomeIcon icon={s.icon} className="text-2xl text-purple-600 dark:text-purple-300" />
            </button>
            <span className="font-semibold text-purple-700 dark:text-purple-200">{s.label}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 text-center">{s.description}</span>
          </div>
        ))}
      </div>
      {/* 실제 예시 이미지 */}
      <div className="mb-6">
        <img src={costImg} alt="공사비 자동 업데이트 예시" width={320} height={180} loading="lazy" className="rounded-lg shadow w-full max-w-md mx-auto" />
        <p className="text-sm text-center text-gray-500 mt-2">예시: 변경 감지 및 자동 견적서 업데이트 화면</p>
      </div>
      {/* 실제 시나리오 흐름/결과물 미리보기 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-lg font-bold text-purple-700 dark:text-purple-200 mb-4">{steps[step].label}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{steps[step].description}</p>
        {step === 0 && (
          <div className="flex flex-col items-center">
            <label htmlFor="file-upload" className="mb-2 font-semibold text-purple-700 dark:text-purple-200">설계 변경 파일 업로드</label>
            <input id="file-upload" type="file" aria-label="설계 변경 파일 업로드" title="설계 변경 파일 업로드" className="mb-4" onChange={handleFileChange} />
            {fileName && <span className="text-sm text-gray-500">업로드 파일: {fileName}</span>}
          </div>
        )}
        {step === 1 && (
          <div className="flex flex-col items-center">
            <FontAwesomeIcon icon={faPlay} className="text-4xl text-purple-500 animate-pulse mb-2" />
            <span className="text-purple-600 dark:text-purple-300">AI가 변경 내역을 분석 중...</span>
          </div>
        )}
        {step === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sampleResult.map((item, idx) => (
              <div key={item.title} className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 flex flex-col items-center">
                {idx === 0 && (
                  <img src="/demo-cost.webp" alt="변경 감지 예시" width={120} height={80} loading="lazy" className="mb-2 rounded shadow" />
                )}
                <span className="font-bold text-purple-700 dark:text-purple-200">{item.title}</span>
                <span className="text-lg text-gray-800 dark:text-gray-100">{item.value}</span>
              </div>
            ))}
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col items-center">
            <button className="px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition mb-2" disabled aria-label="PDF 다운로드" title="PDF 다운로드">PDF 다운로드</button>
            <span className="text-sm text-gray-400">(데모에서는 다운로드가 비활성화되어 있습니다)</span>
          </div>
        )}
      </div>
      {/* 업데이트 결과 미리보기(기존) */}
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
      {/* 주요 UI 흐름 */}
      <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
        <strong>주요 UI 흐름:</strong>
        <ul className="list-disc list-inside mt-2 text-purple-700 dark:text-purple-200">
          <li>설계 변경 내역 입력/업로드 → 변경 감지 알림 → 자동 견적서/비용 내역 업데이트 → 비교/이력 보기</li>
        </ul>
      </div>
      {/* 피드백/후기 섹션 */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mt-8">
        <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-200 mb-4">사용자 후기</h3>
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
          <button type="submit" className="self-end px-4 py-2 rounded bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition disabled:opacity-60" disabled={submitting || feedback.rating === 0}>후기 등록</button>
        </form>
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
}; 