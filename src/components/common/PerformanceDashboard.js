import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
const Dashboard = styled.div `
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;
const Title = styled.h2 `
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
`;
const MetricsGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;
const MetricCard = styled.div `
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;
const MetricValue = styled.div `
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;
const MetricLabel = styled.div `
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;
const ChartContainer = styled.div `
  width: 100%;
  height: 300px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;
export const PerformanceDashboard = () => {
    const { t } = useTranslation('common');
    const [metrics, setMetrics] = useState({
        loadTime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        networkLatency: 0,
    });
    useEffect(() => {
        const updateMetrics = () => {
            // 실제 성능 메트릭을 수집하는 로직
            const performance = window.performance;
            const memory = performance.memory;
            setMetrics({
                loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                memoryUsage: memory ? memory.usedJSHeapSize / 1048576 : 0, // MB 단위로 변환
                cpuUsage: 0, // 실제 CPU 사용량은 서버에서 측정 필요
                networkLatency: performance.timing.responseEnd - performance.timing.requestStart,
            });
        };
        updateMetrics();
        const interval = setInterval(updateMetrics, 5000);
        return () => clearInterval(interval);
    }, []);
    return (_jsxs(Dashboard, { children: [_jsx(Title, { children: t('performance.title') }), _jsxs(MetricsGrid, { children: [_jsxs(MetricCard, { children: [_jsxs(MetricValue, { children: [metrics.loadTime, "ms"] }), _jsx(MetricLabel, { children: t('performance.loadTime') })] }), _jsxs(MetricCard, { children: [_jsxs(MetricValue, { children: [metrics.memoryUsage.toFixed(2), "MB"] }), _jsx(MetricLabel, { children: t('performance.memoryUsage') })] }), _jsxs(MetricCard, { children: [_jsxs(MetricValue, { children: [metrics.cpuUsage, "%"] }), _jsx(MetricLabel, { children: t('performance.cpuUsage') })] }), _jsxs(MetricCard, { children: [_jsxs(MetricValue, { children: [metrics.networkLatency, "ms"] }), _jsx(MetricLabel, { children: t('performance.networkLatency') })] })] }), _jsx(ChartContainer, { children: _jsx("p", { children: t('performance.chartPlaceholder') }) })] }));
};
