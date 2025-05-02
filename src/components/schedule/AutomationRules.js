import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fetchAutomationRules, createAutomationRule, deleteAutomationRule, toggleAutomationRule, } from '../../store/slices/automationSlice';
const Container = styled.div `
  padding: 20px;
`;
const Title = styled.h2 `
  margin-bottom: 20px;
`;
const RuleList = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;
const RuleCard = styled.div `
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
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
const RuleType = styled.span `
  font-size: 0.9em;
  color: #666;
`;
const RuleConditions = styled.div `
  margin-bottom: 10px;
`;
const RuleActions = styled.div `
  margin-bottom: 10px;
`;
const ToggleButton = styled.button `
  background: ${props => (props.active ? '#4CAF50' : '#f44336')};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
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
const Button = styled.button `
  background: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
`;
const AutomationRules = () => {
    const { t } = useTranslation('schedule');
    const dispatch = useDispatch();
    const { rules, loading, error } = useSelector((state) => state.automation);
    const [newRule, setNewRule] = useState({
        name: '',
        type: 'channelSwitch',
        conditions: [],
        actions: [],
        isActive: true,
    });
    useEffect(() => {
        dispatch(fetchAutomationRules());
    }, [dispatch]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRule(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createAutomationRule(newRule));
        setNewRule({
            name: '',
            type: 'channelSwitch',
            conditions: [],
            actions: [],
            isActive: true,
        });
    };
    const handleToggle = (ruleId) => {
        dispatch(toggleAutomationRule(ruleId));
    };
    const handleDelete = (ruleId) => {
        if (window.confirm(t('notifications.automation.confirmDelete'))) {
            dispatch(deleteAutomationRule(ruleId));
        }
    };
    if (loading) {
        return _jsx("div", { children: t('common.loading') });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    return (_jsxs(Container, { children: [_jsx(Title, { children: t('notifications.automation.title') }), _jsx(RuleList, { children: rules.map((rule) => (_jsxs(RuleCard, { children: [_jsxs(RuleHeader, { children: [_jsx(RuleName, { children: rule.name }), _jsx(ToggleButton, { active: rule.isActive, onClick: () => handleToggle(rule.id), children: rule.isActive
                                        ? t('notifications.automation.deactivate')
                                        : t('notifications.automation.activate') })] }), _jsx(RuleType, { children: t(`notifications.automation.types.${rule.type}`) }), _jsxs(RuleConditions, { children: [_jsx("h4", { children: t('notifications.automation.conditions') }), rule.conditions.map((condition, index) => (_jsxs("div", { children: [condition.metric, " ", condition.operator, " ", condition.value] }, index)))] }), _jsxs(RuleActions, { children: [_jsx("h4", { children: t('notifications.automation.actions') }), rule.actions.map((action, index) => (_jsxs("div", { children: [action.type, ": ", JSON.stringify(action.value)] }, index)))] }), _jsx(Button, { onClick: () => handleDelete(rule.id), children: t('notifications.automation.delete') })] }, rule.id))) }), _jsxs(Form, { onSubmit: handleSubmit, children: [_jsx("h3", { children: t('notifications.automation.createRule') }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.automation.name') }), _jsx(Input, { type: "text", name: "name", value: newRule.name, onChange: handleInputChange, required: true })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.automation.type') }), _jsxs(Select, { name: "type", value: newRule.type, onChange: handleInputChange, required: true, children: [_jsx("option", { value: "channelSwitch", children: t('notifications.automation.types.channelSwitch') }), _jsx("option", { value: "priorityAdjustment", children: t('notifications.automation.types.priorityAdjustment') }), _jsx("option", { value: "retryStrategy", children: t('notifications.automation.types.retryStrategy') }), _jsx("option", { value: "fatigueManagement", children: t('notifications.automation.types.fatigueManagement') })] })] }), _jsx(Button, { type: "submit", children: t('notifications.automation.create') })] })] }));
};
export default AutomationRules;
