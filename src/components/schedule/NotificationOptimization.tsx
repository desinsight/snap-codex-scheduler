import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fetchRecommendations, updateRecommendation } from '../../store/slices/notificationOptimizationSlice';
import { NotificationRecommendation } from '../../types/notification';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const RecommendationList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const RecommendationCard = styled.div`
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const CardTitle = styled.h3`
  margin: 0;
`;

const TimeRange = styled.div`
  margin-bottom: 10px;
`;

const ChannelList = styled.div`
  margin-bottom: 10px;
`;

const ChannelTag = styled.span`
  display: inline-block;
  background: #e0e0e0;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const Metrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
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

const LastUpdated = styled.div`
  font-size: 12px;
  color: #666;
  text-align: right;
`;

const NotificationOptimization: React.FC = () => {
  const { t } = useTranslation('schedule');
  const dispatch = useDispatch();
  const { recommendations, loading, error } = useSelector(
    (state: any) => state.notificationOptimization
  );

  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <Title>{t('notifications.optimization.title')}</Title>
      <RecommendationList>
        {recommendations.map((recommendation: NotificationRecommendation) => (
          <RecommendationCard key={recommendation.id}>
            <CardHeader>
              <CardTitle>{recommendation.userId}</CardTitle>
            </CardHeader>
            <TimeRange>
              {t('notifications.optimization.optimalTime')}:{' '}
              {recommendation.optimalTime.start} - {recommendation.optimalTime.end}
            </TimeRange>
            <ChannelList>
              {t('notifications.optimization.preferredChannels')}:
              {recommendation.preferredChannels.map((channel) => (
                <ChannelTag key={channel}>{channel}</ChannelTag>
              ))}
            </ChannelList>
            <Metrics>
              <MetricItem>
                <MetricValue>{recommendation.responseRate}%</MetricValue>
                <MetricLabel>{t('notifications.optimization.responseRate')}</MetricLabel>
              </MetricItem>
              <MetricItem>
                <MetricValue>{recommendation.averageResponseTime}s</MetricValue>
                <MetricLabel>{t('notifications.optimization.averageResponseTime')}</MetricLabel>
              </MetricItem>
            </Metrics>
            <LastUpdated>
              {t('common.lastUpdated')}: {new Date(recommendation.lastUpdated).toLocaleString()}
            </LastUpdated>
          </RecommendationCard>
        ))}
      </RecommendationList>
    </Container>
  );
};

export default NotificationOptimization; 