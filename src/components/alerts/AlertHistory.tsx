import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AlertNotification, AlertPriority } from '../../types/alerts';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AlertItem = styled.div<{ priority: AlertPriority }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.background};
  border-left: 4px solid ${({ theme, priority }) => {
    switch (priority) {
      case 'critical':
        return theme.colors.error;
      case 'high':
        return theme.colors.warning;
      case 'medium':
        return theme.colors.info;
      default:
        return theme.colors.success;
    }
  }};
  border-radius: ${({ theme }) => theme.shape.borderRadius.small};
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertMessage = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const AlertMetadata = styled.div`
  font-size: 0.9em;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

interface Props {
  notifications: AlertNotification[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

const AlertHistory: React.FC<Props> = ({ notifications, onAcknowledge, onResolve }) => {
  const { t } = useTranslation();
  const [filteredNotifications, setFilteredNotifications] = useState(notifications);
  const [priorityFilter, setPriorityFilter] = useState<AlertPriority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved' | 'acknowledged'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    let filtered = [...notifications];
    
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(n => n.priority === priorityFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(n => n.status === statusFilter);
    }
    
    setFilteredNotifications(filtered);
    setCurrentPage(1);
  }, [notifications, priorityFilter, statusFilter]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container>
      <Header>
        <Title>{t('alerts.history.title')}</Title>
        <FilterGroup>
          <Select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as AlertPriority | 'all')}
          >
            <option value="all">{t('alerts.filter.allPriorities')}</option>
            <option value="low">{t('alerts.priority.low')}</option>
            <option value="medium">{t('alerts.priority.medium')}</option>
            <option value="high">{t('alerts.priority.high')}</option>
            <option value="critical">{t('alerts.priority.critical')}</option>
          </Select>
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | 'active' | 'resolved' | 'acknowledged')}
          >
            <option value="all">{t('alerts.filter.allStatuses')}</option>
            <option value="active">{t('alerts.status.active')}</option>
            <option value="resolved">{t('alerts.status.resolved')}</option>
            <option value="acknowledged">{t('alerts.status.acknowledged')}</option>
          </Select>
        </FilterGroup>
      </Header>

      <AlertList>
        {paginatedNotifications.map(notification => (
          <AlertItem key={notification.id} priority={notification.priority}>
            <AlertContent>
              <AlertMessage>{notification.message}</AlertMessage>
              <AlertMetadata>
                {t('alerts.metadata.metric')}: {notification.metadata.metric} |
                {t('alerts.metadata.value')}: {notification.metadata.value} |
                {t('alerts.metadata.threshold')}: {notification.metadata.threshold} |
                {t('alerts.metadata.time')}: {formatTime(notification.timestamp)}
              </AlertMetadata>
            </AlertContent>
            {notification.status === 'active' && (
              <div>
                <ActionButton onClick={() => onAcknowledge(notification.id)}>
                  {t('alerts.action.acknowledge')}
                </ActionButton>
                <ActionButton onClick={() => onResolve(notification.id)}>
                  {t('alerts.action.resolve')}
                </ActionButton>
              </div>
            )}
          </AlertItem>
        ))}
      </AlertList>

      {totalPages > 1 && (
        <Pagination>
          <ActionButton
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            {t('common.previous')}
          </ActionButton>
          <span>
            {t('common.page')} {currentPage} / {totalPages}
          </span>
          <ActionButton
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            {t('common.next')}
          </ActionButton>
        </Pagination>
      )}
    </Container>
  );
};

export default AlertHistory; 