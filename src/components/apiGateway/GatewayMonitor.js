import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { apiGatewayService } from '../../services/apiGatewayService';
const Container = styled.div `
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const Title = styled.h3 `
  margin-bottom: 20px;
`;
const StatsGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;
const StatCard = styled.div `
  padding: 15px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;
const StatValue = styled.div `
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 5px;
`;
const StatLabel = styled.div `
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
const RoutesTable = styled.table `
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;
const TableHeader = styled.th `
  padding: 12px;
  text-align: left;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;
const TableCell = styled.td `
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;
const ErrorRate = styled.span `
  color: ${({ theme, rate }) => rate > 0.1 ? theme.colors.error : rate > 0.05 ? theme.colors.warning : theme.colors.success};
`;
const GatewayMonitor = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        totalRequests: 0,
        activeConnections: 0,
        averageResponseTime: 0,
        errorRate: 0,
        routes: {},
    });
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(apiGatewayService.getStats());
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    return (_jsxs(Container, { children: [_jsx(Title, { children: t('apiGateway.monitor') }), _jsxs(StatsGrid, { children: [_jsxs(StatCard, { children: [_jsx(StatValue, { children: stats.totalRequests }), _jsx(StatLabel, { children: t('apiGateway.totalRequests') })] }), _jsxs(StatCard, { children: [_jsx(StatValue, { children: stats.activeConnections }), _jsx(StatLabel, { children: t('apiGateway.activeConnections') })] }), _jsxs(StatCard, { children: [_jsxs(StatValue, { children: [stats.averageResponseTime.toFixed(2), "ms"] }), _jsx(StatLabel, { children: t('apiGateway.averageResponseTime') })] }), _jsxs(StatCard, { children: [_jsx(StatValue, { children: _jsxs(ErrorRate, { rate: stats.errorRate, children: [(stats.errorRate * 100).toFixed(2), "%"] }) }), _jsx(StatLabel, { children: t('apiGateway.errorRate') })] })] }), _jsxs(RoutesTable, { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx(TableHeader, { children: t('apiGateway.route') }), _jsx(TableHeader, { children: t('apiGateway.requests') }), _jsx(TableHeader, { children: t('apiGateway.errors') }), _jsx(TableHeader, { children: t('apiGateway.averageLatency') })] }) }), _jsx("tbody", { children: Object.entries(stats.routes).map(([path, routeStats]) => (_jsxs("tr", { children: [_jsx(TableCell, { children: path }), _jsx(TableCell, { children: routeStats.requests }), _jsx(TableCell, { children: routeStats.errors }), _jsxs(TableCell, { children: [routeStats.averageLatency.toFixed(2), "ms"] })] }, path))) })] })] }));
};
export default GatewayMonitor;
