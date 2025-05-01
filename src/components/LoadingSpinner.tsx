import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTranslation } from 'react-i18next';

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LoadingDialog = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingMessage = styled.p`
  margin: 0;
  color: #333;
  font-size: 1rem;
`;

const ProgressBar = styled.div<{ width: string }>`
  width: 200px;
  height: 8px;
  background-color: #f3f3f3;
  border-radius: 4px;
  margin-top: 1rem;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.width};
    height: 100%;
    background-color: #3498db;
    transition: width 0.3s ease;
  }
`;

const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading, loadingMessage, loadingProgress } = useSelector((state: RootState) => state.loading);

  if (!isLoading) {
    return null;
  }

  return (
    <LoadingOverlay role="dialog">
      <LoadingDialog>
        <Spinner role="progressbar" />
        <LoadingMessage>{loadingMessage || t('auth.loading.loggingIn')}</LoadingMessage>
        {loadingProgress !== null && (
          <ProgressBar width={`${loadingProgress}%`} role="progressbar" />
        )}
      </LoadingDialog>
    </LoadingOverlay>
  );
};

export default LoadingSpinner; 