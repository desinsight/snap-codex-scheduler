import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { RootState } from '../../store';
import { fetchNotificationHistory } from '../../store/slices/notificationSlice';
import { NotificationHistory } from '../../types/notification';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const HistoryList = styled.ul`
  list-style: none;
  padding: 0;
`;

const HistoryItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HistoryInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const HistoryType = styled.span`
  font-weight: bold;
`;

const HistoryTime = styled.span`
  color: #666;
  font-size: 0.9em;
`;

const HistoryStatus = styled.span<{ status: 'success' | 'failed' }>`
  color: ${({ status }) => (status === 'success' ? '#4CAF50' : '#F44336')};
  font-weight: bold;
`;

interface NotificationHistoryProps {
  scheduleId: string;
}

const NotificationHistory: React.FC<NotificationHistoryProps> = ({ scheduleId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('schedule');
  const { history, loading, error } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotificationHistory(scheduleId));
  }, [dispatch, scheduleId]);

  if (loading) {
    return <div>{t('notifications.loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Container>
      <Title>{t('notifications.history.title')}</Title>
      <HistoryList>
        {history.map((item: NotificationHistory) => (
          <HistoryItem key={item.id}>
            <HistoryInfo>
              <HistoryType>{t(`notifications.types.${item.type}`)}</HistoryType>
              <HistoryTime>{formatDate(item.sentAt)}</HistoryTime>
            </HistoryInfo>
            <HistoryStatus status={item.status}>
              {t(`notifications.history.status.${item.status}`)}
            </HistoryStatus>
          </HistoryItem>
        ))}
        {history.length === 0 && (
          <HistoryItem>
            <span>{t('notifications.history.empty')}</span>
          </HistoryItem>
        )}
      </HistoryList>
    </Container>
  );
};

export default NotificationHistory; 