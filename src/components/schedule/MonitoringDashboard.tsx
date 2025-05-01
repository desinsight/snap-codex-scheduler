import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  fetchMonitoringDashboard,
  subscribeToRealtimeUpdates,
} from '../../store/slices/monitoringSlice';
import { MonitoringDashboard as MonitoringDashboardType } from '../../types/notification';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const MetricCard = styled.div`
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const MetricLabel = styled.div`
  color: #666;
`;

const ChannelStatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const ChannelCard = styled.div<{ status: string }>`
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid ${(props) => {
    switch (props.status) {
      case 'active':
        return '#4CAF50';
      case 'error':
        return '#f44336';
      default:
        return '#ff9800';
    }
  }};
`;

const ChannelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ChannelName = styled.h3`
  margin: 0;
`;

const ChannelStatus = styled.span<{ status: string }>`
  color: ${(props) => {
    switch (props.status) {
      case 'active':
        return '#4CAF50';
      case 'error':
        return '#f44336';
      default:
        return '#ff9800';
    }
  }};
`;

const ChannelMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const RecentNotifications = styled.div`
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
`;

const NotificationList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const NotificationItem = styled.div<{ status: string }>`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(props) => (props.status === 'success' ? '#4CAF50' : '#f44336')};
`;

const MonitoringDashboard: React.FC = () => {
  const { t } = useTranslation('schedule');
  const dispatch = useDispatch();
  const { dashboard, loading, error } = useSelector((state: any) => state.monitoring);

  useEffect(() => {
    dispatch(fetchMonitoringDashboard());
    const subscription = dispatch(subscribeToRealtimeUpdates());
    return () => {
      subscription.then((eventSource) => {
        if (eventSource) {
          eventSource.close();
        }
      });
    };
  }, [dispatch]);

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!dashboard) {
    return null;
  }

  return (
    <Container>
      <Title>{t('notifications.monitoring.title')}</Title>
      <MetricsGrid>
        <MetricCard>
          <MetricValue>{dashboard.realtimeMetrics.notificationsPerMinute}</MetricValue>
          <MetricLabel>{t('notifications.monitoring.notificationsPerMinute')}</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>{dashboard.realtimeMetrics.successRate}%</MetricValue>
          <MetricLabel>{t('notifications.monitoring.successRate')}</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>{dashboard.realtimeMetrics.averageResponseTime}s</MetricValue>
          <MetricLabel>{t('notifications.monitoring.averageResponseTime')}</MetricLabel>
        </MetricCard>
      </MetricsGrid>
      <ChannelStatusGrid>
        {dashboard.channelStatus.map((channel) => (
          <ChannelCard key={channel.channel} status={channel.status}>
            <ChannelHeader>
              <ChannelName>{channel.channel}</ChannelName>
              <ChannelStatus status={channel.status}>
                {t(`notifications.monitoring.status.${channel.status}`)}
              </ChannelStatus>
            </ChannelHeader>
            <ChannelMetrics>
              <div>
                <MetricValue>{channel.metrics.successRate}%</MetricValue>
                <MetricLabel>{t('notifications.monitoring.successRate')}</MetricLabel>
              </div>
              <div>
                <MetricValue>{channel.metrics.averageDeliveryTime}s</MetricValue>
                <MetricLabel>{t('notifications.monitoring.averageDeliveryTime')}</MetricLabel>
              </div>
              <div>
                <MetricValue>{channel.metrics.totalSent}</MetricValue>
                <MetricLabel>{t('notifications.monitoring.totalSent')}</MetricLabel>
              </div>
              <div>
                <MetricValue>{channel.metrics.totalFailed}</MetricValue>
                <MetricLabel>{t('notifications.monitoring.totalFailed')}</MetricLabel>
              </div>
            </ChannelMetrics>
          </ChannelCard>
        ))}
      </ChannelStatusGrid>
      <RecentNotifications>
        <h3>{t('notifications.monitoring.recentNotifications')}</h3>
        <NotificationList>
          {dashboard.recentNotifications.map((notification) => (
            <NotificationItem key={notification.id} status={notification.status}>
              <div>
                {notification.userId} - {notification.channel}
              </div>
              <div>
                {new Date(notification.timestamp).toLocaleTimeString()}
              </div>
            </NotificationItem>
          ))}
        </NotificationList>
      </RecentNotifications>
    </Container>
  );
};

export default MonitoringDashboard; 