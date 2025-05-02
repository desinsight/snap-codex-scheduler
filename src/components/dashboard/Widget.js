import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { DashboardService } from '../../services/DashboardService';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const Container = styled.div `
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div `
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.h3 `
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
`;
const ButtonGroup = styled.div `
  display: flex;
  gap: 8px;
`;
const IconButton = styled.button `
  padding: 4px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
const Content = styled.div `
  flex: 1;
  padding: 16px;
  overflow: hidden;
`;
const MetricValue = styled.div `
  font-size: ${({ theme }) => theme.typography.fontSize.large};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;
const MetricLabel = styled.div `
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
  text-align: center;
  margin-top: 4px;
`;
const Widget = ({ widget, onEdit, onDelete }) => {
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
                return (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { ...commonProps, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "value", stroke: "#8884d8" })] }) }));
            case 'bar':
                return (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { ...commonProps, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", fill: "#8884d8" })] }) }));
            case 'area':
                return (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { ...commonProps, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Area, { type: "monotone", dataKey: "value", stroke: "#8884d8", fill: "#8884d8" })] }) }));
            case 'pie':
                return (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: demoData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 80, fill: "#8884d8" }), _jsx(Tooltip, {})] }) }));
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
        return (_jsxs(_Fragment, { children: [_jsx(MetricValue, { children: formattedValue }), _jsx(MetricLabel, { children: widget.settings.metric })] }));
    };
    const renderContent = () => {
        switch (widget.type) {
            case 'chart':
                return renderChart();
            case 'metric':
                return renderMetric();
            case 'table':
                // 테이블 구현은 별도로 필요
                return _jsx("div", { children: "Table Widget" });
            case 'status':
                // 상태 표시 구현은 별도로 필요
                return _jsx("div", { children: "Status Widget" });
            default:
                return null;
        }
    };
    return (_jsxs(Container, { children: [_jsxs(Header, { className: "widget-header", children: [_jsx(Title, { children: widget.title }), _jsxs(ButtonGroup, { children: [_jsx(IconButton, { onClick: onEdit, title: t('common.edit'), children: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), _jsx("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })] }) }), _jsx(IconButton, { onClick: onDelete, title: t('common.delete'), children: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M3 6h18" }), _jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })] }) })] })] }), _jsx(Content, { children: renderContent() })] }));
};
export default Widget;
