import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { RootState } from '../store';
import { fetchNotificationHistory } from '../store/slices/notificationSlice';
import LoadingSpinner from './LoadingSpinner';

interface NotificationHistoryProps {
  scheduleId: string;
}

const HistoryContainer = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HistoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const HistoryItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const Timestamp = styled.span`
  color: ${({ theme }) => theme.colors.dark};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Message = styled.p`
  margin: 0.5rem 0 0;
  color: ${({ theme }) => theme.colors.dark};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  padding: 1rem;
  text-align: center;
`;

const NotificationHistory: React.FC<NotificationHistoryProps> = ({ scheduleId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { history, loading, error } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotificationHistory(scheduleId));
  }, [dispatch, scheduleId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage>{t('notifications.error.fetchFailed')}</ErrorMessage>;
  }

  if (!history || history.length === 0) {
    return <ErrorMessage>{t('notifications.empty')}</ErrorMessage>;
  }

  return (
    <HistoryContainer>
      <HistoryList>
        {history.map((notification) => (
          <HistoryItem key={notification.id}>
            <Timestamp>{new Date(notification.timestamp).toLocaleString()}</Timestamp>
            <Message>{notification.message}</Message>
          </HistoryItem>
        ))}
      </HistoryList>
    </HistoryContainer>
  );
};

export default NotificationHistory; 