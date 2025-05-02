import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fetchUserBehaviorPatterns } from '../../store/slices/userBehaviorSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, } from 'recharts';
const Container = styled.div `
  padding: 20px;
`;
const Title = styled.h2 `
  margin-bottom: 20px;
`;
const AnalysisGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;
const AnalysisCard = styled.div `
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
`;
const CardTitle = styled.h3 `
  margin: 0 0 15px 0;
`;
const ChartContainer = styled.div `
  height: 300px;
  margin-bottom: 15px;
`;
const MetricsGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
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
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const UserBehaviorAnalysis = () => {
    const { t } = useTranslation('schedule');
    const dispatch = useDispatch();
    const { patterns, loading, error } = useSelector((state) => state.userBehavior);
    useEffect(() => {
        dispatch(fetchUserBehaviorPatterns());
    }, [dispatch]);
    if (loading) {
        return _jsx("div", { children: t('common.loading') });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    const formatTimeData = (pattern) => {
        return pattern.responsePatterns.timeOfDay.map(time => ({
            hour: `${time.hour}:00`,
            responseRate: time.responseRate,
            averageResponseTime: time.averageResponseTime,
        }));
    };
    const formatChannelData = (pattern) => {
        return pattern.responsePatterns.channelPreferences.map(channel => ({
            name: channel.channel,
            value: channel.successRate,
        }));
    };
    const formatPriorityData = (pattern) => {
        return pattern.responsePatterns.priorityPatterns.map(priority => ({
            name: priority.priority,
            value: priority.responseRate,
        }));
    };
    return (_jsxs(Container, { children: [_jsx(Title, { children: t('notifications.analysis.title') }), patterns.map((pattern) => (_jsxs(AnalysisGrid, { children: [_jsxs(AnalysisCard, { children: [_jsx(CardTitle, { children: t('notifications.analysis.timePattern') }), _jsx(ChartContainer, { children: _jsxs(LineChart, { width: 350, height: 300, data: formatTimeData(pattern), margin: { top: 5, right: 30, left: 20, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "hour" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "responseRate", stroke: "#8884d8", name: t('notifications.analysis.responseRate') }), _jsx(Line, { type: "monotone", dataKey: "averageResponseTime", stroke: "#82ca9d", name: t('notifications.analysis.averageResponseTime') })] }) })] }), _jsxs(AnalysisCard, { children: [_jsx(CardTitle, { children: t('notifications.analysis.channelPreference') }), _jsx(ChartContainer, { children: _jsxs(PieChart, { width: 350, height: 300, children: [_jsx(Pie, { data: formatChannelData(pattern), cx: 175, cy: 150, labelLine: false, outerRadius: 80, fill: "#8884d8", dataKey: "value", label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, children: formatChannelData(pattern).map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) })] }), _jsxs(AnalysisCard, { children: [_jsx(CardTitle, { children: t('notifications.analysis.priorityPattern') }), _jsx(ChartContainer, { children: _jsxs(PieChart, { width: 350, height: 300, children: [_jsx(Pie, { data: formatPriorityData(pattern), cx: 175, cy: 150, labelLine: false, outerRadius: 80, fill: "#8884d8", dataKey: "value", label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, children: formatPriorityData(pattern).map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) })] }), _jsxs(AnalysisCard, { children: [_jsx(CardTitle, { children: t('notifications.analysis.engagementMetrics') }), _jsxs(MetricsGrid, { children: [_jsxs(MetricItem, { children: [_jsx(MetricValue, { children: pattern.engagementMetrics.totalNotifications }), _jsx(MetricLabel, { children: t('notifications.analysis.totalNotifications') })] }), _jsxs(MetricItem, { children: [_jsx(MetricValue, { children: pattern.engagementMetrics.totalResponses }), _jsx(MetricLabel, { children: t('notifications.analysis.totalResponses') })] }), _jsxs(MetricItem, { children: [_jsxs(MetricValue, { children: [pattern.engagementMetrics.averageResponseTime, "s"] }), _jsx(MetricLabel, { children: t('notifications.analysis.averageResponseTime') })] }), _jsxs(MetricItem, { children: [_jsxs(MetricValue, { children: [pattern.engagementMetrics.responseRate, "%"] }), _jsx(MetricLabel, { children: t('notifications.analysis.responseRate') })] })] })] })] }, pattern.userId)))] }));
};
export default UserBehaviorAnalysis;
