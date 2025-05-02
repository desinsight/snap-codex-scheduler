import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fetchRecommendations, } from '../../store/slices/notificationOptimizationSlice';
const Container = styled.div `
  padding: 20px;
`;
const Title = styled.h2 `
  margin-bottom: 20px;
`;
const RecommendationList = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;
const RecommendationCard = styled.div `
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
`;
const CardHeader = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const CardTitle = styled.h3 `
  margin: 0;
`;
const TimeRange = styled.div `
  margin-bottom: 10px;
`;
const ChannelList = styled.div `
  margin-bottom: 10px;
`;
const ChannelTag = styled.span `
  display: inline-block;
  background: #e0e0e0;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
  margin-bottom: 8px;
`;
const Metrics = styled.div `
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
`;
const MetricItem = styled.div `
  text-align: center;
`;
const MetricValue = styled.div `
  font-size: 18px;
  font-weight: bold;
`;
const MetricLabel = styled.div `
  font-size: 12px;
  color: #666;
`;
const LastUpdated = styled.div `
  font-size: 12px;
  color: #666;
  text-align: right;
`;
const NotificationOptimization = () => {
    const { t } = useTranslation('schedule');
    const dispatch = useDispatch();
    const { recommendations, loading, error } = useSelector((state) => state.notificationOptimization);
    useEffect(() => {
        dispatch(fetchRecommendations());
    }, [dispatch]);
    if (loading) {
        return _jsx("div", { children: t('common.loading') });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    return (_jsxs(Container, { children: [_jsx(Title, { children: t('notifications.optimization.title') }), _jsx(RecommendationList, { children: recommendations.map((recommendation) => (_jsxs(RecommendationCard, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: recommendation.userId }) }), _jsxs(TimeRange, { children: [t('notifications.optimization.optimalTime'), ": ", recommendation.optimalTime.start, " -", ' ', recommendation.optimalTime.end] }), _jsxs(ChannelList, { children: [t('notifications.optimization.preferredChannels'), ":", recommendation.preferredChannels.map(channel => (_jsx(ChannelTag, { children: channel }, channel)))] }), _jsxs(Metrics, { children: [_jsxs(MetricItem, { children: [_jsxs(MetricValue, { children: [recommendation.responseRate, "%"] }), _jsx(MetricLabel, { children: t('notifications.optimization.responseRate') })] }), _jsxs(MetricItem, { children: [_jsxs(MetricValue, { children: [recommendation.averageResponseTime, "s"] }), _jsx(MetricLabel, { children: t('notifications.optimization.averageResponseTime') })] })] }), _jsxs(LastUpdated, { children: [t('common.lastUpdated'), ": ", new Date(recommendation.lastUpdated).toLocaleString()] })] }, recommendation.id))) })] }));
};
export default NotificationOptimization;
