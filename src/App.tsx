import React from 'react';
import SnapCodexLanding from './pages/Landing';

// Theme 디버깅을 위한 임시 스타일
const debugStyle = {
  border: '5px solid red',
  padding: '20px',
};

function App() {
  return (
    <div style={debugStyle}>
      <SnapCodexLanding />
    </div>
  );
}

export default App;
