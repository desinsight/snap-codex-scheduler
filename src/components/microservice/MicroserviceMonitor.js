import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fetchServiceConfigs, fetchServiceHealth, fetchServiceMetrics, } from '../../store/slices/microserviceSlice';
const Container = styled.div `
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const Title = styled.h3 `
  margin-bottom: 20px;
`;
const ServicesGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;
const ServiceCard = styled.div `
  padding: 15px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 4px solid
    ${({ theme, status }) => status === 'healthy'
    ? theme.colors.success
    : status === 'degraded'
        ? theme.colors.warning
        : theme.colors.error};
`;
const ServiceHeader = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const ServiceName = styled.h4 `
  margin: 0;
`;
const ServiceStatus = styled.span `
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: ${({ theme, status }) => status === 'healthy'
    ? theme.colors.success
    : status === 'degraded'
        ? theme.colors.warning
        : theme.colors.error};
  color: white;
`;
const MetricsGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;
const MetricItem = styled.div `
  display: flex;
  flex-direction: column;
`;
const MetricLabel = styled.span `
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
const MetricValue = styled.span `
  font-size: 16px;
  font-weight: bold;
`;
const ErrorMessage = styled.div `
  color: ${({ theme }) => theme.colors.error};
  margin-top: 10px;
`;
const MicroserviceMonitor = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { services, health, metrics, loading, error } = useSelector((state) => state.microservice);
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
        return _jsx("div", { children: t('common.loading') });
    }
    if (error) {
        return _jsx(ErrorMessage, { children: error });
    }
    return (_jsxs(Container, { children: [_jsx(Title, { children: t('microservice.monitor') }), _jsx(ServicesGrid, { children: Object.entries(services).map(([name, service]) => (_jsxs(ServiceCard, { status: health[name]?.status || 'unknown', children: [_jsxs(ServiceHeader, { children: [_jsx(ServiceName, { children: name }), _jsx(ServiceStatus, { status: health[name]?.status || 'unknown', children: health[name]?.status || 'unknown' })] }), _jsxs(MetricsGrid, { children: [_jsxs(MetricItem, { children: [_jsx(MetricLabel, { children: t('microservice.uptime') }), _jsxs(MetricValue, { children: [Math.floor(health[name]?.uptime || 0), "s"] })] }), _jsxs(MetricItem, { children: [_jsx(MetricLabel, { children: t('microservice.memoryUsage') }), _jsxs(MetricValue, { children: [Math.round(health[name]?.memoryUsage || 0), "%"] })] }), _jsxs(MetricItem, { children: [_jsx(MetricLabel, { children: t('microservice.cpuUsage') }), _jsxs(MetricValue, { children: [Math.round(health[name]?.cpuUsage || 0), "%"] })] }), _jsxs(MetricItem, { children: [_jsx(MetricLabel, { children: t('microservice.requestCount') }), _jsx(MetricValue, { children: metrics[name]?.requestCount || 0 })] })] })] }, name))) })] }));
};
export default MicroserviceMonitor;
