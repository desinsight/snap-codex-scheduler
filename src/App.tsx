import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout } from './components/common/Layout';
import { PrinciplesPage } from './routes/principles/PrinciplesPage';
import { EasyPage } from './routes/principles/EasyPage';
import { HomePage } from './routes/HomePage';
import { OnboardingPage } from './routes/OnboardingPage';
import { ScenarioList } from './routes/scenarios/ScenarioList';
import { ScenarioAnalysis } from './routes/scenarios/ScenarioAnalysis';
import { ScenarioCostUpdate } from './routes/scenarios/ScenarioCostUpdate';
import { ScenarioConceptDesign } from './routes/scenarios/ScenarioConceptDesign';
import { ScenarioCopyright } from './routes/scenarios/ScenarioCopyright';
import { ScenarioNFT } from './routes/scenarios/ScenarioNFT';
import { EvolutionPage } from './routes/principles/EvolutionPage';
import { ExplainablePage } from './routes/principles/ExplainablePage';
import { UniversalPage } from './routes/principles/UniversalPage';
import { UsefulPage } from './routes/principles/UsefulPage';
import { AboutPage } from './routes/AboutPage';

// 임시 데모 페이지 컴포넌트
const DemoPage: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">SnapCodex 데모</h1>
    <p className="text-gray-600 dark:text-gray-300 mb-6">
      SnapCodex의 주요 기능을 직접 체험해보세요.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/30">
        <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">AI 설계 분석</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          EDX 파일을 업로드하여 AI가 자동으로 설계를 분석하고 핵심 요소를 추출합니다.
        </p>
        <Link
          to="/scenarios/analysis"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          체험하기 →
        </Link>
      </div>
      <div className="p-6 rounded-lg bg-purple-50 dark:bg-purple-900/30">
        <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">자동 견적 산출</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          설계 변경 시 자동으로 공사비를 업데이트하고 견적서를 생성합니다.
        </p>
        <Link
          to="/scenarios/cost-update"
          className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
        >
          체험하기 →
        </Link>
      </div>
    </div>
  </div>
);

// Theme 디버깅을 위한 임시 스타일
const debugStyle = {
  border: '5px solid red',
  padding: '20px',
};

export const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/principles" element={<PrinciplesPage />} />
          <Route path="/principles/easy" element={<EasyPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/scenarios" element={<ScenarioList />} />
          <Route path="/scenarios/analysis" element={<ScenarioAnalysis />} />
          <Route path="/scenarios/cost-update" element={<ScenarioCostUpdate />} />
          <Route path="/scenarios/concept-design" element={<ScenarioConceptDesign />} />
          <Route path="/scenarios/copyright" element={<ScenarioCopyright />} />
          <Route path="/scenarios/nft" element={<ScenarioNFT />} />
          <Route path="/principles/evolution" element={<EvolutionPage />} />
          <Route path="/principles/explainable" element={<ExplainablePage />} />
          <Route path="/principles/universal" element={<UniversalPage />} />
          <Route path="/principles/useful" element={<UsefulPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
