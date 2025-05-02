import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { DashboardService } from '../../services/DashboardService';
const Modal = styled.div `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const Container = styled.div `
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 24px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;
const Title = styled.h2 `
  margin: 0 0 24px 0;
  color: ${({ theme }) => theme.colors.text};
`;
const Form = styled.form `
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const FormGroup = styled.div `
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Label = styled.label `
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;
const Input = styled.input `
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;
const Select = styled.select `
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;
const ButtonGroup = styled.div `
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;
const Button = styled.button `
  padding: 8px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme, variant }) => variant === 'secondary' ? theme.colors.secondary : theme.colors.primary};
  color: white;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;
const WidgetEditor = ({ widget, onSave, onClose }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState(widget?.title || '');
    const [type, setType] = useState(widget?.type || 'chart');
    const [settings, setSettings] = useState(widget?.settings || {});
    const dashboardService = DashboardService.getInstance();
    const metricUnits = dashboardService.getMetricUnits();
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            title,
            type,
            settings,
            ...(widget?.id ? { id: widget.id } : {})
        });
    };
    const renderChartSettings = () => (_jsxs(_Fragment, { children: [_jsxs(FormGroup, { children: [_jsx(Label, { children: t('dashboard.widget.chartType') }), _jsxs(Select, { value: settings.chartType || 'line', onChange: e => setSettings({ ...settings, chartType: e.target.value }), children: [_jsx("option", { value: "line", children: t('dashboard.widget.chartTypes.line') }), _jsx("option", { value: "bar", children: t('dashboard.widget.chartTypes.bar') }), _jsx("option", { value: "area", children: t('dashboard.widget.chartTypes.area') }), _jsx("option", { value: "pie", children: t('dashboard.widget.chartTypes.pie') })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('dashboard.widget.metric') }), _jsx(Input, { type: "text", value: settings.metric || '', onChange: e => setSettings({ ...settings, metric: e.target.value }), placeholder: t('dashboard.widget.metricPlaceholder') })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('dashboard.widget.query') }), _jsx(Input, { type: "text", value: settings.query || '', onChange: e => setSettings({ ...settings, query: e.target.value }), placeholder: t('dashboard.widget.queryPlaceholder') })] })] }));
    const renderMetricSettings = () => (_jsxs(_Fragment, { children: [_jsxs(FormGroup, { children: [_jsx(Label, { children: t('dashboard.widget.metric') }), _jsx(Input, { type: "text", value: settings.metric || '', onChange: e => setSettings({ ...settings, metric: e.target.value }), placeholder: t('dashboard.widget.metricPlaceholder') })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('dashboard.widget.unit') }), _jsxs(Select, { value: settings.unit || '', onChange: e => setSettings({ ...settings, unit: e.target.value }), children: [_jsx("option", { value: "", children: t('dashboard.widget.noUnit') }), metricUnits.map(unit => (_jsxs("option", { value: unit.id, children: [unit.name, " (", unit.symbol, ")"] }, unit.id)))] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('dashboard.widget.refreshInterval') }), _jsxs(Select, { value: settings.refreshInterval || 0, onChange: e => setSettings({ ...settings, refreshInterval: Number(e.target.value) }), children: [_jsx("option", { value: 0, children: t('dashboard.widget.noRefresh') }), _jsxs("option", { value: 5000, children: ["5 ", t('common.seconds')] }), _jsxs("option", { value: 10000, children: ["10 ", t('common.seconds')] }), _jsxs("option", { value: 30000, children: ["30 ", t('common.seconds')] }), _jsxs("option", { value: 60000, children: ["1 ", t('common.minute')] })] })] })] }));
    return (_jsx(Modal, { onClick: onClose, children: _jsxs(Container, { onClick: e => e.stopPropagation(), children: [_jsx(Title, { children: widget ? t('dashboard.widget.edit') : t('dashboard.widget.create') }), _jsxs(Form, { onSubmit: handleSubmit, children: [_jsxs(FormGroup, { children: [_jsx(Label, { children: t('dashboard.widget.title') }), _jsx(Input, { type: "text", value: title, onChange: e => setTitle(e.target.value), placeholder: t('dashboard.widget.titlePlaceholder'), required: true })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('dashboard.widget.type') }), _jsxs(Select, { value: type, onChange: e => setType(e.target.value), children: [_jsx("option", { value: "chart", children: t('dashboard.widget.types.chart') }), _jsx("option", { value: "metric", children: t('dashboard.widget.types.metric') }), _jsx("option", { value: "table", children: t('dashboard.widget.types.table') }), _jsx("option", { value: "status", children: t('dashboard.widget.types.status') })] })] }), type === 'chart' && renderChartSettings(), type === 'metric' && renderMetricSettings(), _jsxs(ButtonGroup, { children: [_jsx(Button, { type: "button", variant: "secondary", onClick: onClose, children: t('common.cancel') }), _jsx(Button, { type: "submit", children: widget ? t('common.save') : t('common.create') })] })] })] }) }));
};
export default WidgetEditor;
