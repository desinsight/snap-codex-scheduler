import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fetchMonitoringDashboard, subscribeToRealtimeUpdates, } from '../../store/slices/monitoringSlice';
const Container = styled.div `
  padding: 20px;
`;
const Title = styled.h2 `
  margin-bottom: 20px;
`;
const MetricsGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;
const MetricCard = styled.div `
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
`;
const MetricValue = styled.div `
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`;
const MetricLabel = styled.div `
  color: #666;
`;
const ChannelStatusGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;
const ChannelCard = styled.div `
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid
    ${props => {
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
const ChannelHeader = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const ChannelName = styled.h3 `
  margin: 0;
`;
const ChannelStatus = styled.span `
  color: ${props => {
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
const ChannelMetrics = styled.div `
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;
const RecentNotifications = styled.div `
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
`;
const NotificationList = styled.div `
  max-height: 300px;
  overflow-y: auto;
`;
const NotificationItem = styled.div `
  padding: 10px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => (props.status === 'success' ? '#4CAF50' : '#f44336')};
`;
const MonitoringDashboard = () => {
    const { t } = useTranslation('schedule');
    const dispatch = useDispatch();
    const { dashboard, loading, error } = useSelector((state) => state.monitoring);
    useEffect(() => {
        dispatch(fetchMonitoringDashboard());
        const subscription = dispatch(subscribeToRealtimeUpdates());
        return () => {
            subscription.then(eventSource => {
                if (eventSource) {
                    eventSource.close();
                }
            });
        };
    }, [dispatch]);
    if (loading) {
        return _jsx("div", { children: t('common.loading') });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    if (!dashboard) {
        return null;
    }
    return (_jsxs(Container, { children: [_jsx(Title, { children: t('notifications.monitoring.title') }), _jsxs(MetricsGrid, { children: [_jsxs(MetricCard, { children: [_jsx(MetricValue, { children: dashboard.realtimeMetrics.notificationsPerMinute }), _jsx(MetricLabel, { children: t('notifications.monitoring.notificationsPerMinute') })] }), _jsxs(MetricCard, { children: [_jsxs(MetricValue, { children: [dashboard.realtimeMetrics.successRate, "%"] }), _jsx(MetricLabel, { children: t('notifications.monitoring.successRate') })] }), _jsxs(MetricCard, { children: [_jsxs(MetricValue, { children: [dashboard.realtimeMetrics.averageResponseTime, "s"] }), _jsx(MetricLabel, { children: t('notifications.monitoring.averageResponseTime') })] })] }), _jsx(ChannelStatusGrid, { children: dashboard.channelStatus.map(channel => (_jsxs(ChannelCard, { status: channel.status, children: [_jsxs(ChannelHeader, { children: [_jsx(ChannelName, { children: channel.channel }), _jsx(ChannelStatus, { status: channel.status, children: t(`notifications.monitoring.status.${channel.status}`) })] }), _jsxs(ChannelMetrics, { children: [_jsxs("div", { children: [_jsxs(MetricValue, { children: [channel.metrics.successRate, "%"] }), _jsx(MetricLabel, { children: t('notifications.monitoring.successRate') })] }), _jsxs("div", { children: [_jsxs(MetricValue, { children: [channel.metrics.averageDeliveryTime, "s"] }), _jsx(MetricLabel, { children: t('notifications.monitoring.averageDeliveryTime') })] }), _jsxs("div", { children: [_jsx(MetricValue, { children: channel.metrics.totalSent }), _jsx(MetricLabel, { children: t('notifications.monitoring.totalSent') })] }), _jsxs("div", { children: [_jsx(MetricValue, { children: channel.metrics.totalFailed }), _jsx(MetricLabel, { children: t('notifications.monitoring.totalFailed') })] })] })] }, channel.channel))) }), _jsxs(RecentNotifications, { children: [_jsx("h3", { children: t('notifications.monitoring.recentNotifications') }), _jsx(NotificationList, { children: dashboard.recentNotifications.map(notification => (_jsxs(NotificationItem, { status: notification.status, children: [_jsxs("div", { children: [notification.userId, " - ", notification.channel] }), _jsx("div", { children: new Date(notification.timestamp).toLocaleTimeString() })] }, notification.id))) })] })] }));
};
export default MonitoringDashboard;
