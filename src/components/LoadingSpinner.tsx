import React from 'react';
<<<<<<< HEAD
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTranslation } from 'react-i18next';
=======
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
<<<<<<< HEAD
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
=======
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

<<<<<<< HEAD
const LoadingDialog = styled.div`
=======
const LoadingContainer = styled.div`
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
<<<<<<< HEAD
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
=======
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
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

<<<<<<< HEAD
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
=======
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
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    transition: width 0.3s ease;
  }
`;

<<<<<<< HEAD
=======
const Message = styled.p`
  margin: 0;
  color: #666;
  text-align: center;
`;

>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading, loadingMessage, loadingProgress } = useSelector((state: RootState) => state.loading);

<<<<<<< HEAD
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
=======
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
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    </LoadingOverlay>
  );
};

export default LoadingSpinner; 