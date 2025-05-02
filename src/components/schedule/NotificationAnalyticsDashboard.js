import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { fetchNotificationStats, fetchUserBehaviorPatterns, fetchFatigueLevels, fetchSmartSettings, } from '../../store/slices/notificationAnalyticsSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, } from 'recharts';
const DashboardContainer = styled.div `
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;
const Title = styled.h1 `
  margin-bottom: 20px;
  color: #333;
`;
const StatsGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;
const StatCard = styled.div `
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const StatTitle = styled.h3 `
  margin-bottom: 10px;
  color: #666;
`;
const StatValue = styled.div `
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;
const ChartContainer = styled.div `
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;
const ChartTitle = styled.h2 `
  margin-bottom: 20px;
  color: #333;
`;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const NotificationAnalyticsDashboard = () => {
    const { t } = useTranslation('schedule');
    const dispatch = useDispatch();
    const { stats, userPatterns, fatigueLevels, smartSettings, loading, error } = useSelector((state) => state.notificationAnalytics);
    useEffect(() => {
        dispatch(fetchNotificationStats());
        dispatch(fetchUserBehaviorPatterns());
        dispatch(fetchFatigueLevels());
        dispatch(fetchSmartSettings());
    }, [dispatch]);
    if (loading) {
        return _jsx("div", { children: t('loading') });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    return (_jsxs(DashboardContainer, { children: [_jsx(Title, { children: t('notifications.analytics.title') }), _jsxs(StatsGrid, { children: [_jsxs(StatCard, { children: [_jsx(StatTitle, { children: t('notifications.analytics.successRate') }), _jsxs(StatValue, { children: [(stats.successRate * 100).toFixed(1), "%"] })] }), _jsxs(StatCard, { children: [_jsx(StatTitle, { children: t('notifications.analytics.totalSent') }), _jsx(StatValue, { children: stats.totalSent })] }), _jsxs(StatCard, { children: [_jsx(StatTitle, { children: t('notifications.analytics.totalSuccess') }), _jsx(StatValue, { children: stats.totalSuccess })] }), _jsxs(StatCard, { children: [_jsx(StatTitle, { children: t('notifications.analytics.totalFailed') }), _jsx(StatValue, { children: stats.totalFailed })] })] }), _jsxs(ChartContainer, { children: [_jsx(ChartTitle, { children: t('notifications.analytics.hourlyDistribution') }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: stats.hourlyDistribution, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "hour" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "count", fill: "#8884d8" })] }) })] }), _jsxs(ChartContainer, { children: [_jsx(ChartTitle, { children: t('notifications.analytics.categoryDistribution') }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: stats.categoryDistribution, dataKey: "count", nameKey: "category", cx: "50%", cy: "50%", outerRadius: 100, label: true, children: stats.categoryDistribution.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {}), _jsx(Legend, {})] }) })] }), _jsxs(ChartContainer, { children: [_jsx(ChartTitle, { children: t('notifications.analytics.failureReasons') }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: stats.failureReasons, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "reason" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "count", fill: "#ff4d4f" })] }) })] }), _jsxs(ChartContainer, { children: [_jsx(ChartTitle, { children: t('notifications.analytics.userResponseRates') }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: stats.userResponseRates, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "user" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "responseRate", fill: "#52c41a" })] }) })] })] }));
};
export default NotificationAnalyticsDashboard;
