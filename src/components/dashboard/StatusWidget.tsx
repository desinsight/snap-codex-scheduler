import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { WidgetConfig } from '../../types/dashboard';
import { DashboardService } from '../../services/DashboardService';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
`;

const StatusCard = styled.div<{ status: 'success' | 'warning' | 'error' | 'info' }>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${({ theme, status }) => {
    switch (status) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.border;
    }
  }};
`;

const StatusTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const StatusValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.large};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const StatusDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
  margin-top: 4px;
`;

const StatusIndicator = styled.div<{ status: 'success' | 'warning' | 'error' | 'info' }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${({ theme, status }) => {
    switch (status) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.border;
    }
  }};
`;

interface StatusItem {
  id: string;
  title: string;
  value: string | number;
  description?: string;
  status: 'success' | 'warning' | 'error' | 'info';
  lastUpdated: string;
}

interface Props {
  widget: WidgetConfig;
}

const StatusWidget: React.FC<Props> = ({ widget }) => {
  const { t } = useTranslation();
  const [statusItems, setStatusItems] = useState<StatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dashboardService = DashboardService.getInstance();

  useEffect(() => {
    const loadStatus = async () => {
      try {
        setLoading(true);
        // 실제 구현에서는 API에서 상태 데이터를 가져와야 합니다
        const response = await fetch(widget.settings.query || '');
        const data = await response.json();
        setStatusItems(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load status');
      } finally {
        setLoading(false);
      }
    };

    loadStatus();

    // 실시간 업데이트 설정
    if (widget.settings.refreshInterval) {
      const interval = setInterval(loadStatus, widget.settings.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [widget.settings.query, widget.settings.refreshInterval]);

  if (loading) return <div>{t('common.loading')}</div>;
  if (error) return <div>{error}</div>;
  if (statusItems.length === 0) return <div>{t('common.noData')}</div>;

  return (
    <Container>
      {statusItems.map(item => (
        <StatusCard key={item.id} status={item.status}>
          <StatusTitle>
            <StatusIndicator status={item.status} />
            {item.title}
          </StatusTitle>
          <StatusValue>
            {dashboardService.formatMetricValue(item.value, widget.settings.unit || '')}
          </StatusValue>
          {item.description && (
            <StatusDescription>{item.description}</StatusDescription>
          )}
          <StatusDescription>
            {t('common.lastUpdated')}: {new Date(item.lastUpdated).toLocaleString()}
          </StatusDescription>
        </StatusCard>
      ))}
    </Container>
  );
};

export default StatusWidget; 