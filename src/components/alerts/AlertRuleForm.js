import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
const Form = styled.form `
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
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
const ThresholdGroup = styled.div `
  display: flex;
  gap: 10px;
  align-items: center;
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
const ChannelConfig = styled.div `
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-top: 10px;
`;
const AlertRuleForm = ({ initialRule, onSubmit }) => {
    const { t } = useTranslation();
    const [rule, setRule] = useState(initialRule || {
        name: '',
        description: '',
        priority: 'medium',
        thresholds: [],
        channels: [],
        enabled: true,
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isValidRule(rule)) {
            onSubmit(rule);
        }
    };
    const addThreshold = () => {
        setRule(prev => ({
            ...prev,
            thresholds: [
                ...(prev.thresholds || []),
                { metric: '', operator: '>', value: 0, duration: 60 },
            ],
        }));
    };
    const updateThreshold = (index, threshold) => {
        setRule(prev => ({
            ...prev,
            thresholds: prev.thresholds?.map((t, i) => i === index ? { ...t, ...threshold } : t),
        }));
    };
    const removeThreshold = (index) => {
        setRule(prev => ({
            ...prev,
            thresholds: prev.thresholds?.filter((_, i) => i !== index),
        }));
    };
    const toggleChannel = (channel) => {
        setRule(prev => ({
            ...prev,
            channels: prev.channels?.includes(channel)
                ? prev.channels.filter(c => c !== channel)
                : [...(prev.channels || []), channel],
        }));
    };
    return (_jsxs(Form, { onSubmit: handleSubmit, children: [_jsxs(FormGroup, { children: [_jsx(Label, { children: t('alerts.rule.name') }), _jsx(Input, { type: "text", value: rule.name, onChange: e => setRule(prev => ({ ...prev, name: e.target.value })), required: true })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('alerts.rule.description') }), _jsx(Input, { type: "text", value: rule.description, onChange: e => setRule(prev => ({ ...prev, description: e.target.value })) })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('alerts.rule.priority') }), _jsxs(Select, { value: rule.priority, onChange: e => setRule(prev => ({ ...prev, priority: e.target.value })), children: [_jsx("option", { value: "low", children: t('alerts.priority.low') }), _jsx("option", { value: "medium", children: t('alerts.priority.medium') }), _jsx("option", { value: "high", children: t('alerts.priority.high') }), _jsx("option", { value: "critical", children: t('alerts.priority.critical') })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('alerts.rule.thresholds') }), rule.thresholds?.map((threshold, index) => (_jsxs(ThresholdGroup, { children: [_jsxs(Select, { value: threshold.metric, onChange: e => updateThreshold(index, { metric: e.target.value }), children: [_jsx("option", { value: "", children: t('alerts.threshold.selectMetric') }), _jsx("option", { value: "cpu", children: "CPU Usage" }), _jsx("option", { value: "memory", children: "Memory Usage" }), _jsx("option", { value: "errorRate", children: "Error Rate" }), _jsx("option", { value: "latency", children: "Latency" })] }), _jsxs(Select, { value: threshold.operator, onChange: e => updateThreshold(index, { operator: e.target.value }), children: [_jsx("option", { value: ">", children: ">" }), _jsx("option", { value: ">=", children: ">=" }), _jsx("option", { value: "<", children: "<" }), _jsx("option", { value: "<=", children: "<=" }), _jsx("option", { value: "==", children: "=" })] }), _jsx(Input, { type: "number", value: threshold.value, onChange: e => updateThreshold(index, { value: Number(e.target.value) }), style: { width: '100px' } }), _jsx(Input, { type: "number", value: threshold.duration, onChange: e => updateThreshold(index, { duration: Number(e.target.value) }), placeholder: t('alerts.threshold.duration'), style: { width: '100px' } }), _jsx(Button, { type: "button", variant: "secondary", onClick: () => removeThreshold(index), children: t('common.remove') })] }, index))), _jsx(Button, { type: "button", onClick: addThreshold, children: t('alerts.threshold.add') })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('alerts.rule.channels') }), _jsxs("div", { children: [_jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: rule.channels?.includes('email'), onChange: () => toggleChannel('email') }), "Email"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: rule.channels?.includes('slack'), onChange: () => toggleChannel('slack') }), "Slack"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: rule.channels?.includes('webhook'), onChange: () => toggleChannel('webhook') }), "Webhook"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: rule.channels?.includes('inApp'), onChange: () => toggleChannel('inApp') }), "In-App"] })] })] }), _jsx(Button, { type: "submit", children: t('common.save') })] }));
};
const isValidRule = (rule) => {
    return !!(rule.name &&
        rule.priority &&
        rule.thresholds?.length &&
        rule.channels?.length);
};
export default AlertRuleForm;
