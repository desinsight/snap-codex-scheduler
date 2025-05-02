import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, } from 'recharts';
const Dashboard = styled.div `
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 768px) {
    padding: 10px;
    gap: 15px;
  }
`;
const Header = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
`;
const Title = styled.h2 `
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;
const Controls = styled.div `
  display: flex;
  gap: 10px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;
const RefreshButton = styled.button `
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;
const TimeRangeSelect = styled.select `
  padding: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;
const MetricsGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;
const NodeStatusGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;
const MigrationStatusCard = styled.div `
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  box-shadow: ${({ theme }) => theme.shadows.small};
  margin-bottom: 20px;
  
  @media (max-width: 576px) {
    padding: 15px;
  }
`;
const MigrationProgress = styled.div `
  width: 100%;
  height: 20px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
`;
const ProgressBar = styled.div `
  width: ${props => props.progress}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease;
`;
const MigrationMetrics = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;
const MigrationMetric = styled.div `
  text-align: center;
`;
const MetricValue = styled.div `
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;
const MetricLabel = styled.div `
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
const NodeStatus = styled.div `
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background-color: ${({ theme, status }) => {
    switch (status) {
        case 'active':
            return theme.colors.success;
        case 'error':
            return theme.colors.error;
        default:
            return theme.colors.warning;
    }
}};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: white;
`;
const ChartsContainer = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-top: 20px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;
const ChartCard = styled.div `
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  @media (max-width: 576px) {
    padding: 15px;
  }
`;
const ChartTitle = styled.h3 `
  margin-bottom: 15px;
  color: ${({ theme }) => theme.colors.text};
`;
const CustomTooltip = styled.div `
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 10px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;
const DistributedCacheDashboard = () => {
    const { t } = useTranslation();
    const [nodes, setNodes] = useState([]);
    const [migrationStatus, setMigrationStatus] = useState(null);
    const [metricsHistory, setMetricsHistory] = useState([]);
    const [systemStatus, setSystemStatus] = useState({
        cpuUsage: 0,
        memoryUsage: 0,
        networkIO: { bytesIn: 0, bytesOut: 0 },
        lastUpdate: new Date().toISOString()
    });
    const [timeRange, setTimeRange] = useState('1h');
    const [isAutoRefresh, setIsAutoRefresh] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(5000);
    const refreshTimerRef = useRef();
    const fetchSystemMetrics = async () => {
        try {
            const response = await fetch('/api/cache/system-metrics');
            if (response.ok) {
                const data = await response.json();
                setSystemStatus(prev => ({
                    ...data,
                    lastUpdate: new Date().toISOString()
                }));
            }
        }
        catch (error) {
            console.error('Error fetching system metrics:', error);
        }
    };
    const calculateMetrics = (nodesData) => {
        const totalHits = nodesData.reduce((sum, node) => sum + node.metrics.hits, 0);
        const totalMisses = nodesData.reduce((sum, node) => sum + node.metrics.misses, 0);
        const total = totalHits + totalMisses;
        return {
            hitRate: total > 0 ? (totalHits / total) * 100 : 0,
            missRate: total > 0 ? (totalMisses / total) * 100 : 0,
            errorRate: nodesData.filter(node => node.status === 'error').length / nodesData.length * 100
        };
    };
    const fetchData = useCallback(async () => {
        try {
            // Fetch nodes status
            const nodesResponse = await fetch('/api/cache/nodes');
            const nodesData = await nodesResponse.json();
            setNodes(nodesData);
            // Fetch migration status if active
            const migrationResponse = await fetch('/api/cache/migration');
            if (migrationResponse.ok) {
                const migrationData = await migrationResponse.json();
                setMigrationStatus(migrationData);
            }
            // Calculate performance metrics
            const { hitRate, missRate, errorRate } = calculateMetrics(nodesData);
            // Update metrics history
            const newMetrics = {
                timestamp: new Date().toISOString(),
                totalKeys: nodesData.reduce((sum, node) => sum + node.metrics.keys, 0),
                totalMemory: nodesData.reduce((sum, node) => sum + node.metrics.memory, 0),
                hitRate,
                missRate,
                latency: Math.random() * 100, // Replace with actual latency measurement
                errorRate
            };
            setMetricsHistory(prev => [...prev, newMetrics].slice(-30));
            // Fetch system metrics
            await fetchSystemMetrics();
        }
        catch (error) {
            console.error('Error fetching cache data:', error);
        }
    }, []);
    useEffect(() => {
        fetchData();
        if (isAutoRefresh) {
            refreshTimerRef.current = setInterval(fetchData, refreshInterval);
        }
        return () => {
            if (refreshTimerRef.current) {
                clearInterval(refreshTimerRef.current);
            }
        };
    }, [fetchData, isAutoRefresh, refreshInterval]);
    const formatMemory = (bytes) => {
        const mb = bytes / 1024 / 1024;
        return `${mb.toFixed(2)} MB`;
    };
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString();
    };
    const CustomTooltipContent = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (_jsxs(CustomTooltip, { children: [_jsx("p", { children: formatTime(label) }), payload.map((entry, index) => (_jsxs("p", { style: { color: entry.color }, children: [entry.name, ": ", entry.name.includes('Memory') ? formatMemory(entry.value) : entry.value] }, index)))] }));
        }
        return null;
    };
    const nodeMetrics = nodes.map(node => ({
        name: node.id,
        keys: node.metrics.keys,
        memory: node.metrics.memory / 1024 / 1024,
        hits: node.metrics.hits,
        misses: node.metrics.misses,
    }));
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
    const handleRefresh = () => {
        // Refresh data
        fetchData();
    };
    const handleTimeRangeChange = (e) => {
        setTimeRange(e.target.value);
        // Update metrics history based on time range
        // Implementation depends on your API
    };
    const toggleAutoRefresh = () => {
        setIsAutoRefresh(!isAutoRefresh);
    };
    const handleRefreshIntervalChange = (e) => {
        setRefreshInterval(Number(e.target.value));
    };
    return (_jsxs(Dashboard, { children: [_jsxs(Header, { children: [_jsx(Title, { children: t('monitoring.distributedCache.title') }), _jsxs(Controls, { children: [_jsxs(TimeRangeSelect, { value: timeRange, onChange: handleTimeRangeChange, children: [_jsx("option", { value: "5m", children: t('monitoring.timeRange.5m') }), _jsx("option", { value: "15m", children: t('monitoring.timeRange.15m') }), _jsx("option", { value: "1h", children: t('monitoring.timeRange.1h') }), _jsx("option", { value: "6h", children: t('monitoring.timeRange.6h') }), _jsx("option", { value: "24h", children: t('monitoring.timeRange.24h') })] }), _jsxs("select", { value: refreshInterval, onChange: handleRefreshIntervalChange, children: [_jsx("option", { value: "1000", children: t('monitoring.refresh.1s') }), _jsx("option", { value: "5000", children: t('monitoring.refresh.5s') }), _jsx("option", { value: "10000", children: t('monitoring.refresh.10s') }), _jsx("option", { value: "30000", children: t('monitoring.refresh.30s') })] }), _jsx(RefreshButton, { onClick: toggleAutoRefresh, children: isAutoRefresh ? t('monitoring.pause') : t('monitoring.resume') }), _jsx(RefreshButton, { onClick: handleRefresh, children: t('monitoring.refresh') })] })] }), _jsxs(MetricsGrid, { children: [_jsxs(MetricCard, { children: [_jsx(MetricValue, { children: nodes.reduce((sum, node) => sum + node.metrics.keys, 0) }), _jsx(MetricLabel, { children: t('monitoring.distributedCache.totalKeys') })] }), _jsxs(MetricCard, { children: [_jsxs(MetricValue, { children: [(nodes.reduce((sum, node) => sum + node.metrics.memory, 0) / 1024 / 1024).toFixed(2), " MB"] }), _jsx(MetricLabel, { children: t('monitoring.distributedCache.totalMemory') })] }), _jsxs(MetricCard, { children: [_jsx(MetricValue, { children: nodes.reduce((sum, node) => sum + node.metrics.hits, 0) }), _jsx(MetricLabel, { children: t('monitoring.distributedCache.totalHits') })] }), _jsxs(MetricCard, { children: [_jsx(MetricValue, { children: metricsHistory.length > 0 ? `${metricsHistory[metricsHistory.length - 1].hitRate.toFixed(2)}%` : '0%' }), _jsx(MetricLabel, { children: t('monitoring.distributedCache.hitRate') })] }), _jsxs(MetricCard, { children: [_jsx(MetricValue, { children: metricsHistory.length > 0 ? `${metricsHistory[metricsHistory.length - 1].latency.toFixed(2)}ms` : '0ms' }), _jsx(MetricLabel, { children: t('monitoring.distributedCache.latency') })] })] }), migrationStatus && (_jsxs(MigrationStatusCard, { children: [_jsx("h3", { children: t('monitoring.distributedCache.migration') }), _jsx(MigrationProgress, { children: _jsx(ProgressBar, { progress: migrationStatus.progress }) }), _jsxs(MigrationMetrics, { children: [_jsxs(MigrationMetric, { children: [_jsxs(MetricValue, { children: [migrationStatus.progress.toFixed(2), "%"] }), _jsx(MetricLabel, { children: t('monitoring.distributedCache.progress') })] }), _jsxs(MigrationMetric, { children: [_jsx(MetricValue, { children: migrationStatus.processed }), _jsx(MetricLabel, { children: t('monitoring.distributedCache.processed') })] }), _jsxs(MigrationMetric, { children: [_jsx(MetricValue, { children: migrationStatus.errors }), _jsx(MetricLabel, { children: t('monitoring.distributedCache.errors') })] }), _jsxs(MigrationMetric, { children: [_jsxs(MetricValue, { children: [migrationStatus.duration.toFixed(2), "s"] }), _jsx(MetricLabel, { children: t('monitoring.distributedCache.duration') })] })] })] })), _jsx(NodeStatusGrid, { children: nodes.map(node => (_jsx(NodeStatus, { status: node.status, children: _jsxs("div", { children: [_jsx("strong", { children: node.id }), _jsxs("div", { children: ["Keys: ", node.metrics.keys] }), _jsxs("div", { children: ["Memory: ", formatMemory(node.metrics.memory)] }), _jsxs("div", { children: ["Hits: ", node.metrics.hits] }), _jsxs("div", { children: ["Misses: ", node.metrics.misses] })] }) }, node.id))) }), _jsxs(ChartsContainer, { children: [_jsxs(ChartCard, { children: [_jsx(ChartTitle, { children: t('monitoring.distributedCache.keysTrend') }), _jsx(ResponsiveContainer, { width: "100%", height: 300, minWidth: 300, children: _jsxs(AreaChart, { data: metricsHistory, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "timestamp", tickFormatter: formatTime, interval: "preserveStartEnd" }), _jsx(YAxis, {}), _jsx(Tooltip, { content: _jsx(CustomTooltipContent, {}) }), _jsx(Legend, {}), _jsx(Area, { type: "monotone", dataKey: "totalKeys", stroke: "#8884d8", fill: "#8884d8", fillOpacity: 0.3 })] }) })] }), _jsxs(ChartCard, { children: [_jsx(ChartTitle, { children: t('monitoring.distributedCache.memoryTrend') }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: metricsHistory, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "timestamp", tickFormatter: formatTime, interval: "preserveStartEnd" }), _jsx(YAxis, {}), _jsx(Tooltip, { content: _jsx(CustomTooltipContent, {}) }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "totalMemory", stroke: "#82ca9d", strokeWidth: 2, dot: false })] }) })] }), _jsxs(ChartCard, { children: [_jsx(ChartTitle, { children: t('monitoring.distributedCache.nodeDistribution') }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: nodeMetrics, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "keys", fill: "#8884d8" }), _jsx(Bar, { dataKey: "hits", fill: "#82ca9d" })] }) })] }), _jsxs(ChartCard, { children: [_jsx(ChartTitle, { children: t('monitoring.distributedCache.memoryDistribution') }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: nodeMetrics, dataKey: "memory", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 100, label: true, children: nodeMetrics.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {}), _jsx(Legend, {})] }) })] }), _jsxs(ChartCard, { children: [_jsx(ChartTitle, { children: t('monitoring.distributedCache.performanceMetrics') }), _jsx(ResponsiveContainer, { width: "100%", height: 300, minWidth: 300, children: _jsxs(LineChart, { data: metricsHistory, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "timestamp", tickFormatter: formatTime, interval: "preserveStartEnd" }), _jsx(YAxis, {}), _jsx(Tooltip, { content: _jsx(CustomTooltipContent, {}) }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "hitRate", name: t('monitoring.distributedCache.hitRate'), stroke: "#82ca9d", strokeWidth: 2, dot: false }), _jsx(Line, { type: "monotone", dataKey: "latency", name: t('monitoring.distributedCache.latency'), stroke: "#8884d8", strokeWidth: 2, dot: false }), _jsx(Line, { type: "monotone", dataKey: "errorRate", name: t('monitoring.distributedCache.errorRate'), stroke: "#ff7300", strokeWidth: 2, dot: false })] }) })] }), _jsxs(ChartCard, { children: [_jsx(ChartTitle, { children: t('monitoring.distributedCache.systemMetrics') }), _jsx(ResponsiveContainer, { width: "100%", height: 300, minWidth: 300, children: _jsxs(LineChart, { data: [systemStatus], children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "lastUpdate", tickFormatter: formatTime }), _jsx(YAxis, {}), _jsx(Tooltip, { content: _jsx(CustomTooltipContent, {}) }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "cpuUsage", name: t('monitoring.system.cpu'), stroke: "#82ca9d", strokeWidth: 2 }), _jsx(Line, { type: "monotone", dataKey: "memoryUsage", name: t('monitoring.system.memory'), stroke: "#8884d8", strokeWidth: 2 })] }) })] })] })] }));
};
export default DistributedCacheDashboard;
