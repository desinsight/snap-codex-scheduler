import React from 'react';
import styled from 'styled-components';
import Navigation from '../navigation/Navigation';

const MainContent = styled.main`
  padding-top: 64px;
  min-height: calc(100vh - 64px);
  background-color: ${({ theme }) => theme.colors.background};
`;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Navigation />
      <MainContent>{children}</MainContent>
    </>
  );
};

export default MainLayout; 