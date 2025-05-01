import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { GatewayStats } from '../../types/apiGateway';
import { apiGatewayService } from '../../services/apiGatewayService';

const Container = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  margin-bottom: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  padding: 15px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RoutesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ErrorRate = styled.span<{ rate: number }>`
  color: ${({ theme, rate }) => 
    rate > 0.1 ? theme.colors.error : 
    rate > 0.05 ? theme.colors.warning : 
    theme.colors.success
  };
`;

const GatewayMonitor: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<GatewayStats>({
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

  return (
    <Container>
      <Title>{t('apiGateway.monitor')}</Title>

      <StatsGrid>
        <StatCard>
          <StatValue>{stats.totalRequests}</StatValue>
          <StatLabel>{t('apiGateway.totalRequests')}</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{stats.activeConnections}</StatValue>
          <StatLabel>{t('apiGateway.activeConnections')}</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{stats.averageResponseTime.toFixed(2)}ms</StatValue>
          <StatLabel>{t('apiGateway.averageResponseTime')}</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>
            <ErrorRate rate={stats.errorRate}>
              {(stats.errorRate * 100).toFixed(2)}%
            </ErrorRate>
          </StatValue>
          <StatLabel>{t('apiGateway.errorRate')}</StatLabel>
        </StatCard>
      </StatsGrid>

      <RoutesTable>
        <thead>
          <tr>
            <TableHeader>{t('apiGateway.route')}</TableHeader>
            <TableHeader>{t('apiGateway.requests')}</TableHeader>
            <TableHeader>{t('apiGateway.errors')}</TableHeader>
            <TableHeader>{t('apiGateway.averageLatency')}</TableHeader>
          </tr>
        </thead>
        <tbody>
          {Object.entries(stats.routes).map(([path, routeStats]) => (
            <tr key={path}>
              <TableCell>{path}</TableCell>
              <TableCell>{routeStats.requests}</TableCell>
              <TableCell>{routeStats.errors}</TableCell>
              <TableCell>{routeStats.averageLatency.toFixed(2)}ms</TableCell>
            </tr>
          ))}
        </tbody>
      </RoutesTable>
    </Container>
  );
};

export default GatewayMonitor; 