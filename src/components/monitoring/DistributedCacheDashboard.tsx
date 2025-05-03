import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

const Dashboard = styled.div`
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

const Header = styled.div`
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

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const RefreshButton = styled.button`
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.shape.borderRadius.small};
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const TimeRangeSelect = styled.select`
  padding: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const NodeStatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const MigrationStatusCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  box-shadow: ${({ theme }) => theme.shadows.small};
  margin-bottom: 20px;
  
  @media (max-width: 576px) {
    padding: 15px;
  }
`;

const MigrationProgress = styled.div`
  width: 100%;
  height: 20px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease;
`;

const MigrationMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

const MigrationMetric = styled.div`
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const MetricLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const NodeStatus = styled.div<{ status: string }>`
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

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-top: 20px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  @media (max-width: 576px) {
    padding: 15px;
  }
`;

const ChartTitle = styled.h3`
  margin-bottom: 15px;
  color: ${({ theme }) => theme.colors.text};
`;

const CustomTooltip = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 10px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

interface CacheNode {
  id: string;
  status: 'active' | 'error' | 'syncing';
  metrics: {
    keys: number;
    memory: number;
    hits: number;
    misses: number;
  };
}

interface MigrationStatus {
  progress: number;
  total: number;
  processed: number;
  errors: number;
  duration: number;
}

interface CacheMetrics {
  timestamp: string;
  totalKeys: number;
  totalMemory: number;
  hitRate: number;
  missRate: number;
  latency: number;
  errorRate: number;
}

interface SystemStatus {
  cpuUsage: number;
  memoryUsage: number;
  networkIO: {
    bytesIn: number;
    bytesOut: number;
  };
  lastUpdate: string;
}

const DistributedCacheDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState<CacheNode[]>([]);
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<CacheMetrics[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    cpuUsage: 0,
    memoryUsage: 0,
    networkIO: { bytesIn: 0, bytesOut: 0 },
    lastUpdate: new Date().toISOString()
  });
  const [timeRange, setTimeRange] = useState('1h');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const refreshTimerRef = useRef<NodeJS.Timeout>();

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
    } catch (error) {
      console.error('Error fetching system metrics:', error);
    }
  };

  const calculateMetrics = (nodesData: CacheNode[]) => {
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
      const newMetrics: CacheMetrics = {
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
    } catch (error) {
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

  const formatMemory = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <p>{formatTime(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Memory') ? formatMemory(entry.value) : entry.value}
            </p>
          ))}
        </CustomTooltip>
      );
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

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
    // Update metrics history based on time range
    // Implementation depends on your API
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
  };

  const handleRefreshIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRefreshInterval(Number(e.target.value));
  };

  return (
    <Dashboard>
      <Header>
        <Title>{t('monitoring.distributedCache.title')}</Title>
        <Controls>
          <TimeRangeSelect value={timeRange} onChange={handleTimeRangeChange}>
            <option value="5m">{t('monitoring.timeRange.5m')}</option>
            <option value="15m">{t('monitoring.timeRange.15m')}</option>
            <option value="1h">{t('monitoring.timeRange.1h')}</option>
            <option value="6h">{t('monitoring.timeRange.6h')}</option>
            <option value="24h">{t('monitoring.timeRange.24h')}</option>
          </TimeRangeSelect>
          <select value={refreshInterval} onChange={handleRefreshIntervalChange}>
            <option value="1000">{t('monitoring.refresh.1s')}</option>
            <option value="5000">{t('monitoring.refresh.5s')}</option>
            <option value="10000">{t('monitoring.refresh.10s')}</option>
            <option value="30000">{t('monitoring.refresh.30s')}</option>
          </select>
          <RefreshButton onClick={toggleAutoRefresh}>
            {isAutoRefresh ? t('monitoring.pause') : t('monitoring.resume')}
          </RefreshButton>
          <RefreshButton onClick={handleRefresh}>
            {t('monitoring.refresh')}
          </RefreshButton>
        </Controls>
      </Header>

      <MetricsGrid>
        <MetricCard>
          <MetricValue>
            {nodes.reduce((sum, node) => sum + node.metrics.keys, 0)}
          </MetricValue>
          <MetricLabel>{t('monitoring.distributedCache.totalKeys')}</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>
            {(nodes.reduce((sum, node) => sum + node.metrics.memory, 0) / 1024 / 1024).toFixed(2)} MB
          </MetricValue>
          <MetricLabel>{t('monitoring.distributedCache.totalMemory')}</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>
            {nodes.reduce((sum, node) => sum + node.metrics.hits, 0)}
          </MetricValue>
          <MetricLabel>{t('monitoring.distributedCache.totalHits')}</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>
            {metricsHistory.length > 0 ? `${metricsHistory[metricsHistory.length - 1].hitRate.toFixed(2)}%` : '0%'}
          </MetricValue>
          <MetricLabel>{t('monitoring.distributedCache.hitRate')}</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>
            {metricsHistory.length > 0 ? `${metricsHistory[metricsHistory.length - 1].latency.toFixed(2)}ms` : '0ms'}
          </MetricValue>
          <MetricLabel>{t('monitoring.distributedCache.latency')}</MetricLabel>
        </MetricCard>
      </MetricsGrid>

      {migrationStatus && (
        <MigrationStatusCard>
          <h3>{t('monitoring.distributedCache.migration')}</h3>
          <MigrationProgress>
            <ProgressBar progress={migrationStatus.progress} />
          </MigrationProgress>
          <MigrationMetrics>
            <MigrationMetric>
              <MetricValue>{migrationStatus.progress.toFixed(2)}%</MetricValue>
              <MetricLabel>{t('monitoring.distributedCache.progress')}</MetricLabel>
            </MigrationMetric>
            <MigrationMetric>
              <MetricValue>{migrationStatus.processed}</MetricValue>
              <MetricLabel>{t('monitoring.distributedCache.processed')}</MetricLabel>
            </MigrationMetric>
            <MigrationMetric>
              <MetricValue>{migrationStatus.errors}</MetricValue>
              <MetricLabel>{t('monitoring.distributedCache.errors')}</MetricLabel>
            </MigrationMetric>
            <MigrationMetric>
              <MetricValue>{migrationStatus.duration.toFixed(2)}s</MetricValue>
              <MetricLabel>{t('monitoring.distributedCache.duration')}</MetricLabel>
            </MigrationMetric>
          </MigrationMetrics>
        </MigrationStatusCard>
      )}

      <NodeStatusGrid>
        {nodes.map(node => (
          <NodeStatus key={node.id} status={node.status}>
            <div>
              <strong>{node.id}</strong>
              <div>Keys: {node.metrics.keys}</div>
              <div>Memory: {formatMemory(node.metrics.memory)}</div>
              <div>Hits: {node.metrics.hits}</div>
              <div>Misses: {node.metrics.misses}</div>
            </div>
          </NodeStatus>
        ))}
      </NodeStatusGrid>

      <ChartsContainer>
        <ChartCard>
          <ChartTitle>{t('monitoring.distributedCache.keysTrend')}</ChartTitle>
          <ResponsiveContainer width="100%" height={300} minWidth={300}>
            <AreaChart data={metricsHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTime}
                interval="preserveStartEnd"
              />
              <YAxis />
              <Tooltip content={<CustomTooltipContent />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="totalKeys" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>{t('monitoring.distributedCache.memoryTrend')}</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metricsHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTime}
                interval="preserveStartEnd"
              />
              <YAxis />
              <Tooltip content={<CustomTooltipContent />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalMemory" 
                stroke="#82ca9d" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>{t('monitoring.distributedCache.nodeDistribution')}</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nodeMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="keys" fill="#8884d8" />
              <Bar dataKey="hits" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>{t('monitoring.distributedCache.memoryDistribution')}</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={nodeMetrics}
                dataKey="memory"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {nodeMetrics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>{t('monitoring.distributedCache.performanceMetrics')}</ChartTitle>
          <ResponsiveContainer width="100%" height={300} minWidth={300}>
            <LineChart data={metricsHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTime}
                interval="preserveStartEnd"
              />
              <YAxis />
              <Tooltip content={<CustomTooltipContent />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="hitRate" 
                name={t('monitoring.distributedCache.hitRate')}
                stroke="#82ca9d" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="latency" 
                name={t('monitoring.distributedCache.latency')}
                stroke="#8884d8" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="errorRate" 
                name={t('monitoring.distributedCache.errorRate')}
                stroke="#ff7300" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>{t('monitoring.distributedCache.systemMetrics')}</ChartTitle>
          <ResponsiveContainer width="100%" height={300} minWidth={300}>
            <LineChart data={[systemStatus]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lastUpdate" tickFormatter={formatTime} />
              <YAxis />
              <Tooltip content={<CustomTooltipContent />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cpuUsage" 
                name={t('monitoring.system.cpu')}
                stroke="#82ca9d" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="memoryUsage" 
                name={t('monitoring.system.memory')}
                stroke="#8884d8" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsContainer>
    </Dashboard>
  );
};

export default DistributedCacheDashboard; 