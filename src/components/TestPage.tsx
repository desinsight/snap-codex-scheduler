import React from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TestSection = styled.section`
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const TestTitle = styled.h2`
  color: #333;
  margin-bottom: 1rem;
`;

const TestButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const TestPage: React.FC = () => {
  return (
    <TestContainer>
      <TestSection>
        <TestTitle>기본 테스트</TestTitle>
        <TestButton>테스트 버튼</TestButton>
      </TestSection>

      <TestSection>
        <TestTitle>테마 테스트</TestTitle>
        <p>다크 모드와 라이트 모드 테스트</p>
      </TestSection>

      <TestSection>
        <TestTitle>반응형 테스트</TestTitle>
        <p>다양한 화면 크기에서의 레이아웃 테스트</p>
      </TestSection>

      <TestSection>
        <TestTitle>접근성 테스트</TestTitle>
        <button aria-label="접근성 테스트 버튼">접근성 버튼</button>
      </TestSection>
    </TestContainer>
  );
};

export default TestPage; 