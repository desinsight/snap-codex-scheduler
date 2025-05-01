import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  fetchServiceConfigs,
  fetchServiceHealth,
  fetchServiceMetrics,
  updateCircuitBreaker
} from '../../store/slices/microserviceSlice';
import { RootState } from '../../store';

const Container = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  margin-bottom: 20px;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ServiceCard = styled.div<{ status: string }>`
  padding: 15px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${({ theme, status }) =>
    status === 'healthy' ? theme.colors.success :
    status === 'degraded' ? theme.colors.warning :
    theme.colors.error};
`;

const ServiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ServiceName = styled.h4`
  margin: 0;
`;

const ServiceStatus = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: ${({ theme, status }) =>
    status === 'healthy' ? theme.colors.success :
    status === 'degraded' ? theme.colors.warning :
    theme.colors.error};
  color: white;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetricLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MetricValue = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  margin-top: 10px;
`;

const MicroserviceMonitor: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    services,
    health,
    metrics,
    loading,
    error
  } = useSelector((state: RootState) => state.microservice);

  useEffect(() => {
    dispatch(fetchServiceConfigs());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      Object.keys(services).forEach(name => {
        dispatch(fetchServiceHealth(name));
        dispatch(fetchServiceMetrics(name));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, services]);

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Title>{t('microservice.monitor')}</Title>
      <ServicesGrid>
        {Object.entries(services).map(([name, service]) => (
          <ServiceCard
            key={name}
            status={health[name]?.status || 'unknown'}
          >
            <ServiceHeader>
              <ServiceName>{name}</ServiceName>
              <ServiceStatus status={health[name]?.status || 'unknown'}>
                {health[name]?.status || 'unknown'}
              </ServiceStatus>
            </ServiceHeader>
            <MetricsGrid>
              <MetricItem>
                <MetricLabel>{t('microservice.uptime')}</MetricLabel>
                <MetricValue>
                  {Math.floor(health[name]?.uptime || 0)}s
                </MetricValue>
              </MetricItem>
              <MetricItem>
                <MetricLabel>{t('microservice.memoryUsage')}</MetricLabel>
                <MetricValue>
                  {Math.round(health[name]?.memoryUsage || 0)}%
                </MetricValue>
              </MetricItem>
              <MetricItem>
                <MetricLabel>{t('microservice.cpuUsage')}</MetricLabel>
                <MetricValue>
                  {Math.round(health[name]?.cpuUsage || 0)}%
                </MetricValue>
              </MetricItem>
              <MetricItem>
                <MetricLabel>{t('microservice.requestCount')}</MetricLabel>
                <MetricValue>
                  {metrics[name]?.requestCount || 0}
                </MetricValue>
              </MetricItem>
            </MetricsGrid>
          </ServiceCard>
        ))}
      </ServicesGrid>
    </Container>
  );
};

export default MicroserviceMonitor; 