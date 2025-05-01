import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LoadingContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 300px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 4px;
  background-color: #f3f3f3;
  border-radius: 2px;
  margin: 1rem 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background-color: #3498db;
    border-radius: 2px;
    transition: width 0.3s ease;
  }
`;

const Message = styled.p`
  margin: 0;
  color: #666;
  text-align: center;
`;

const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading, loadingMessage, loadingProgress } = useSelector((state: RootState) => state.loading);

  if (!isLoading) return null;

  return (
    <LoadingOverlay role="dialog" aria-label={t('loading.title')}>
      <LoadingContainer>
        <Spinner role="progressbar" aria-label={t('loading.spinner')} />
        {loadingProgress !== null && (
          <ProgressBar
            progress={loadingProgress}
            role="progressbar"
            aria-valuenow={loadingProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        )}
        <Message role="status" aria-live="polite">
          {loadingMessage || t('loading.defaultMessage')}
        </Message>
      </LoadingContainer>
    </LoadingOverlay>
  );
};

export default LoadingSpinner; 