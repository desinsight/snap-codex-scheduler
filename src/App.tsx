import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/common/Layout';
import { PrinciplesPage } from './routes/principles';
import { PrincipleDetail } from './components/principles/PrincipleDetail';
import { principles } from './data/principles';
import { HomePage } from './routes/HomePage';
import { OnboardingPage } from './routes/OnboardingPage';

// 임시 데모 페이지 컴포넌트
const DemoPage: React.FC = () => (
  <div className="bg-white shadow-lg rounded-lg p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">SnapCodex 데모</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {principles.map((principle) => (
        <div key={principle.id} className={`p-4 rounded-lg bg-${principle.color}-50`}>
          <h2 className="text-lg font-semibold mb-2">{principle.koreanName}</h2>
          <p className="text-gray-600">{principle.description}</p>
          <a
            href={`/principles/${principle.id}`}
            className={`mt-2 inline-block text-${principle.color}-600 hover:text-${principle.color}-700`}
          >
            자세히 보기 →
          </a>
        </div>
      ))}
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
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          {principles.map((principle) => (
            <Route
              key={principle.id}
              path={`/principles/${principle.id}`}
              element={<PrincipleDetail principle={principle} />}
            />
          ))}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
