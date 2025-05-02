import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fetchChannelMetrics, fetchOptimizationRules, createOptimizationRule, deleteOptimizationRule, toggleOptimizationRule, } from '../../store/slices/channelOptimizationSlice';
const Container = styled.div `
  padding: 20px;
`;
const Title = styled.h2 `
  margin-bottom: 20px;
`;
const MetricsGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;
const MetricCard = styled.div `
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
`;
const MetricHeader = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const MetricTitle = styled.h3 `
  margin: 0;
`;
const MetricValue = styled.div `
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`;
const MetricLabel = styled.div `
  color: #666;
`;
const RuleList = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;
const RuleCard = styled.div `
  background: ${({ active }) => (active ? '#f0f8ff' : '#f5f5f5')};
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  position: relative;
`;
const RuleHeader = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const RuleName = styled.h3 `
  margin: 0;
`;
const ToggleButton = styled.button `
  background: ${({ active }) => (active ? '#4caf50' : '#f44336')};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
`;
const RuleContent = styled.div `
  margin-bottom: 10px;
`;
const RuleLabel = styled.div `
  font-weight: bold;
  margin-bottom: 5px;
`;
const RuleValue = styled.div `
  margin-bottom: 10px;
`;
const ActionButtons = styled.div `
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;
const Button = styled.button `
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background: #1976d2;
  }
`;
const DeleteButton = styled(Button) `
  background: #f44336;

  &:hover {
    background: #d32f2f;
  }
`;
const Form = styled.form `
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
`;
const FormGroup = styled.div `
  margin-bottom: 15px;
`;
const Label = styled.label `
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;
const Input = styled.input `
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
const Select = styled.select `
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
const ChannelOptimization = () => {
    const { t } = useTranslation('schedule');
    const dispatch = useDispatch();
    const { metrics, rules, loading, error } = useSelector((state) => state.channelOptimization);
    const [newRule, setNewRule] = useState({
        channel: 'email',
        conditions: {
            minSuccessRate: 90,
            maxDeliveryTime: 60,
            timeRange: {
                start: 0,
                end: 24,
            },
        },
        actions: {
            adjustPriority: true,
            switchChannel: undefined,
            delayTime: undefined,
        },
        isActive: true,
    });
    useEffect(() => {
        dispatch(fetchChannelMetrics());
        dispatch(fetchOptimizationRules());
    }, [dispatch]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('conditions.')) {
            const field = name.split('.')[1];
            setNewRule({
                ...newRule,
                conditions: {
                    ...newRule.conditions,
                    [field]: value,
                },
            });
        }
        else if (name.startsWith('conditions.timeRange.')) {
            const field = name.split('.')[2];
            setNewRule({
                ...newRule,
                conditions: {
                    ...newRule.conditions,
                    timeRange: {
                        ...newRule.conditions.timeRange,
                        [field]: parseInt(value),
                    },
                },
            });
        }
        else if (name.startsWith('actions.')) {
            const field = name.split('.')[1];
            setNewRule({
                ...newRule,
                actions: {
                    ...newRule.actions,
                    [field]: value === 'true' ? true : value === 'false' ? false : value,
                },
            });
        }
        else {
            setNewRule({
                ...newRule,
                [name]: value,
            });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createOptimizationRule(newRule));
        setNewRule({
            channel: 'email',
            conditions: {
                minSuccessRate: 90,
                maxDeliveryTime: 60,
                timeRange: {
                    start: 0,
                    end: 24,
                },
            },
            actions: {
                adjustPriority: true,
                switchChannel: undefined,
                delayTime: undefined,
            },
            isActive: true,
        });
    };
    const handleToggle = (ruleId) => {
        dispatch(toggleOptimizationRule(ruleId));
    };
    const handleDelete = (ruleId) => {
        if (window.confirm(t('notifications.optimization.confirmDelete'))) {
            dispatch(deleteOptimizationRule(ruleId));
        }
    };
    if (loading) {
        return _jsx("div", { children: t('common.loading') });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    return (_jsxs(Container, { children: [_jsx(Title, { children: t('notifications.optimization.title') }), _jsx(MetricsGrid, { children: metrics.map(metric => (_jsxs(MetricCard, { children: [_jsx(MetricHeader, { children: _jsx(MetricTitle, { children: metric.channel }) }), _jsxs(MetricValue, { children: [metric.successRate, "%"] }), _jsx(MetricLabel, { children: t('notifications.optimization.successRate') }), _jsxs(MetricValue, { children: [metric.averageDeliveryTime, "s"] }), _jsx(MetricLabel, { children: t('notifications.optimization.averageDeliveryTime') }), _jsx(MetricValue, { children: metric.totalSent }), _jsx(MetricLabel, { children: t('notifications.optimization.totalSent') }), _jsx(MetricValue, { children: metric.totalFailed }), _jsx(MetricLabel, { children: t('notifications.optimization.totalFailed') })] }, metric.channel))) }), _jsx(RuleList, { children: rules.map((rule) => (_jsxs(RuleCard, { active: rule.isActive, children: [_jsxs(RuleHeader, { children: [_jsx(RuleName, { children: rule.channel }), _jsx(ToggleButton, { active: rule.isActive, onClick: () => handleToggle(rule.id), children: rule.isActive ? t('common.active') : t('common.inactive') })] }), _jsxs(RuleContent, { children: [_jsx(RuleLabel, { children: t('notifications.optimization.conditions') }), _jsxs(RuleValue, { children: [t('notifications.optimization.minSuccessRate'), ": ", rule.conditions.minSuccessRate, "%", _jsx("br", {}), t('notifications.optimization.maxDeliveryTime'), ": ", rule.conditions.maxDeliveryTime, "s", _jsx("br", {}), t('notifications.optimization.timeRange'), ": ", rule.conditions.timeRange.start, "h -", ' ', rule.conditions.timeRange.end, "h"] }), _jsx(RuleLabel, { children: t('notifications.optimization.actions') }), _jsxs(RuleValue, { children: [t('notifications.optimization.adjustPriority'), ":", ' ', rule.actions.adjustPriority ? t('common.yes') : t('common.no'), _jsx("br", {}), rule.actions.switchChannel &&
                                            `${t('notifications.optimization.switchTo')}: ${rule.actions.switchChannel}`, rule.actions.delayTime &&
                                            `${t('notifications.optimization.delayTime')}: ${rule.actions.delayTime}s`] })] }), _jsxs(ActionButtons, { children: [_jsx(Button, { onClick: () => handleToggle(rule.id), children: rule.isActive ? t('common.deactivate') : t('common.activate') }), _jsx(DeleteButton, { onClick: () => handleDelete(rule.id), children: t('common.delete') })] })] }, rule.id))) }), _jsxs(Form, { onSubmit: handleSubmit, children: [_jsx("h3", { children: t('notifications.optimization.createRule') }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.optimization.channel') }), _jsx(Select, { name: "channel", value: newRule.channel, onChange: handleInputChange, children: Object.values(NotificationChannel).map(channel => (_jsx("option", { value: channel, children: channel }, channel))) })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.optimization.minSuccessRate') }), _jsx(Input, { type: "number", name: "conditions.minSuccessRate", value: newRule.conditions.minSuccessRate, onChange: handleInputChange, min: "0", max: "100", required: true })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.optimization.maxDeliveryTime') }), _jsx(Input, { type: "number", name: "conditions.maxDeliveryTime", value: newRule.conditions.maxDeliveryTime, onChange: handleInputChange, min: "0", required: true })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.optimization.timeRange') }), _jsxs("div", { style: { display: 'flex', gap: '10px' }, children: [_jsx(Input, { type: "number", name: "conditions.timeRange.start", value: newRule.conditions.timeRange.start, onChange: handleInputChange, min: "0", max: "23", required: true }), _jsx(Input, { type: "number", name: "conditions.timeRange.end", value: newRule.conditions.timeRange.end, onChange: handleInputChange, min: "1", max: "24", required: true })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.optimization.adjustPriority') }), _jsxs(Select, { name: "actions.adjustPriority", value: newRule.actions.adjustPriority.toString(), onChange: handleInputChange, children: [_jsx("option", { value: "true", children: t('common.yes') }), _jsx("option", { value: "false", children: t('common.no') })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.optimization.switchChannel') }), _jsxs(Select, { name: "actions.switchChannel", value: newRule.actions.switchChannel || '', onChange: handleInputChange, children: [_jsx("option", { value: "", children: t('notifications.optimization.none') }), Object.values(NotificationChannel).map(channel => (_jsx("option", { value: channel, children: channel }, channel)))] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.optimization.delayTime') }), _jsx(Input, { type: "number", name: "actions.delayTime", value: newRule.actions.delayTime || '', onChange: handleInputChange, min: "0" })] }), _jsx(Button, { type: "submit", children: t('notifications.optimization.create') })] })] }));
};
export default ChannelOptimization;
