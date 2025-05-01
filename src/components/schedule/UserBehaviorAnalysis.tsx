import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fetchUserBehaviorPatterns } from '../../store/slices/userBehaviorSlice';
import { UserBehaviorPattern } from '../../types/notification';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const AnalysisCard = styled.div`
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
`;

const CardTitle = styled.h3`
  margin: 0 0 15px 0;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: 15px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const MetricItem = styled.div`
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const MetricLabel = styled.div`
  font-size: 12px;
  color: #666;
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const UserBehaviorAnalysis: React.FC = () => {
  const { t } = useTranslation('schedule');
  const dispatch = useDispatch();
  const { patterns, loading, error } = useSelector(
    (state: any) => state.userBehavior
  );

  useEffect(() => {
    dispatch(fetchUserBehaviorPatterns());
  }, [dispatch]);

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const formatTimeData = (pattern: UserBehaviorPattern) => {
    return pattern.responsePatterns.timeOfDay.map((time) => ({
      hour: `${time.hour}:00`,
      responseRate: time.responseRate,
      averageResponseTime: time.averageResponseTime,
    }));
  };

  const formatChannelData = (pattern: UserBehaviorPattern) => {
    return pattern.responsePatterns.channelPreferences.map((channel) => ({
      name: channel.channel,
      value: channel.successRate,
    }));
  };

  const formatPriorityData = (pattern: UserBehaviorPattern) => {
    return pattern.responsePatterns.priorityPatterns.map((priority) => ({
      name: priority.priority,
      value: priority.responseRate,
    }));
  };

  return (
    <Container>
      <Title>{t('notifications.analysis.title')}</Title>
      {patterns.map((pattern: UserBehaviorPattern) => (
        <AnalysisGrid key={pattern.userId}>
          <AnalysisCard>
            <CardTitle>{t('notifications.analysis.timePattern')}</CardTitle>
            <ChartContainer>
              <LineChart
                width={350}
                height={300}
                data={formatTimeData(pattern)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="responseRate"
                  stroke="#8884d8"
                  name={t('notifications.analysis.responseRate')}
                />
                <Line
                  type="monotone"
                  dataKey="averageResponseTime"
                  stroke="#82ca9d"
                  name={t('notifications.analysis.averageResponseTime')}
                />
              </LineChart>
            </ChartContainer>
          </AnalysisCard>

          <AnalysisCard>
            <CardTitle>{t('notifications.analysis.channelPreference')}</CardTitle>
            <ChartContainer>
              <PieChart width={350} height={300}>
                <Pie
                  data={formatChannelData(pattern)}
                  cx={175}
                  cy={150}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {formatChannelData(pattern).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ChartContainer>
          </AnalysisCard>

          <AnalysisCard>
            <CardTitle>{t('notifications.analysis.priorityPattern')}</CardTitle>
            <ChartContainer>
              <PieChart width={350} height={300}>
                <Pie
                  data={formatPriorityData(pattern)}
                  cx={175}
                  cy={150}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {formatPriorityData(pattern).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ChartContainer>
          </AnalysisCard>

          <AnalysisCard>
            <CardTitle>{t('notifications.analysis.engagementMetrics')}</CardTitle>
            <MetricsGrid>
              <MetricItem>
                <MetricValue>{pattern.engagementMetrics.totalNotifications}</MetricValue>
                <MetricLabel>{t('notifications.analysis.totalNotifications')}</MetricLabel>
              </MetricItem>
              <MetricItem>
                <MetricValue>{pattern.engagementMetrics.totalResponses}</MetricValue>
                <MetricLabel>{t('notifications.analysis.totalResponses')}</MetricLabel>
              </MetricItem>
              <MetricItem>
                <MetricValue>{pattern.engagementMetrics.averageResponseTime}s</MetricValue>
                <MetricLabel>{t('notifications.analysis.averageResponseTime')}</MetricLabel>
              </MetricItem>
              <MetricItem>
                <MetricValue>{pattern.engagementMetrics.responseRate}%</MetricValue>
                <MetricLabel>{t('notifications.analysis.responseRate')}</MetricLabel>
              </MetricItem>
            </MetricsGrid>
          </AnalysisCard>
        </AnalysisGrid>
      ))}
    </Container>
  );
};

export default UserBehaviorAnalysis; 