import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { WidgetConfig } from '../../types/dashboard';
import { DashboardService } from '../../services/DashboardService';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  padding: 4px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 16px;
  overflow: hidden;
`;

const MetricValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.large};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const MetricLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
  text-align: center;
  margin-top: 4px;
`;

interface Props {
  widget: WidgetConfig;
  onEdit: () => void;
  onDelete: () => void;
}

const Widget: React.FC<Props> = ({ widget, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const dashboardService = DashboardService.getInstance();

  const renderChart = () => {
    // 실제 구현에서는 데이터를 API에서 가져와야 합니다
    const demoData = [
      { name: 'Jan', value: 400 },
      { name: 'Feb', value: 300 },
      { name: 'Mar', value: 600 },
      { name: 'Apr', value: 800 },
      { name: 'May', value: 500 }
    ];

    const commonProps = {
      data: demoData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    };

    switch (widget.settings.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={demoData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const renderMetric = () => {
    // 실제 구현에서는 데이터를 API에서 가져와야 합니다
    const demoValue = 42;
    const formattedValue = widget.settings.unit
      ? dashboardService.formatMetricValue(demoValue, widget.settings.unit)
      : demoValue;

    return (
      <>
        <MetricValue>{formattedValue}</MetricValue>
        <MetricLabel>{widget.settings.metric}</MetricLabel>
      </>
    );
  };

  const renderContent = () => {
    switch (widget.type) {
      case 'chart':
        return renderChart();
      case 'metric':
        return renderMetric();
      case 'table':
        // 테이블 구현은 별도로 필요
        return <div>Table Widget</div>;
      case 'status':
        // 상태 표시 구현은 별도로 필요
        return <div>Status Widget</div>;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Header className="widget-header">
        <Title>{widget.title}</Title>
        <ButtonGroup>
          <IconButton onClick={onEdit} title={t('common.edit')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </IconButton>
          <IconButton onClick={onDelete} title={t('common.delete')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </IconButton>
        </ButtonGroup>
      </Header>
      <Content>{renderContent()}</Content>
    </Container>
  );
};

export default Widget; 