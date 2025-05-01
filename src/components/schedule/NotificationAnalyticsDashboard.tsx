import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  fetchNotificationStats,
  fetchUserBehaviorPatterns,
  fetchFatigueLevels,
  fetchSmartSettings,
} from '../../store/slices/notificationAnalyticsSlice';
import { RootState } from '../../store';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: #333;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  margin-bottom: 10px;
  color: #666;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const ChartContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const ChartTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const NotificationAnalyticsDashboard: React.FC = () => {
  const { t } = useTranslation('schedule');
  const dispatch = useDispatch();
  const {
    stats,
    userPatterns,
    fatigueLevels,
    smartSettings,
    loading,
    error,
  } = useSelector((state: RootState) => state.notificationAnalytics);

  useEffect(() => {
    dispatch(fetchNotificationStats());
    dispatch(fetchUserBehaviorPatterns());
    dispatch(fetchFatigueLevels());
    dispatch(fetchSmartSettings());
  }, [dispatch]);

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <DashboardContainer>
      <Title>{t('notifications.analytics.title')}</Title>

      <StatsGrid>
        <StatCard>
          <StatTitle>{t('notifications.analytics.successRate')}</StatTitle>
          <StatValue>{(stats.successRate * 100).toFixed(1)}%</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>{t('notifications.analytics.totalSent')}</StatTitle>
          <StatValue>{stats.totalSent}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>{t('notifications.analytics.totalSuccess')}</StatTitle>
          <StatValue>{stats.totalSuccess}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>{t('notifications.analytics.totalFailed')}</StatTitle>
          <StatValue>{stats.totalFailed}</StatValue>
        </StatCard>
      </StatsGrid>

      <ChartContainer>
        <ChartTitle>{t('notifications.analytics.hourlyDistribution')}</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.hourlyDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>{t('notifications.analytics.categoryDistribution')}</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stats.categoryDistribution}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {stats.categoryDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>{t('notifications.analytics.failureReasons')}</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.failureReasons}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="reason" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#ff4d4f" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>{t('notifications.analytics.userResponseRates')}</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.userResponseRates}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="user" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="responseRate" fill="#52c41a" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </DashboardContainer>
  );
};

export default NotificationAnalyticsDashboard; 