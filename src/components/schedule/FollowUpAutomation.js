import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fetchFollowUpRules, createFollowUpRule, deleteFollowUpRule, toggleFollowUpRule, } from '../../store/slices/followUpAutomationSlice';
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
const FollowUpAutomation = () => {
    const { t } = useTranslation('schedule');
    const dispatch = useDispatch();
    const { rules, loading, error } = useSelector((state) => state.followUpAutomation);
    const [newRule, setNewRule] = useState({
        name: '',
        conditions: {
            responseType: 'ignore',
            timeSinceNotification: 24,
            priority: 'medium',
        },
        actions: {
            channel: 'email',
            templateId: '',
            delay: 1,
            maxRetries: 3,
        },
        isActive: true,
    });
    useEffect(() => {
        dispatch(fetchFollowUpRules());
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
        else if (name.startsWith('actions.')) {
            const field = name.split('.')[1];
            setNewRule({
                ...newRule,
                actions: {
                    ...newRule.actions,
                    [field]: value,
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
        dispatch(createFollowUpRule(newRule));
        setNewRule({
            name: '',
            conditions: {
                responseType: 'ignore',
                timeSinceNotification: 24,
                priority: 'medium',
            },
            actions: {
                channel: 'email',
                templateId: '',
                delay: 1,
                maxRetries: 3,
            },
            isActive: true,
        });
    };
    const handleToggle = (ruleId) => {
        dispatch(toggleFollowUpRule(ruleId));
    };
    const handleDelete = (ruleId) => {
        if (window.confirm(t('notifications.followUp.confirmDelete'))) {
            dispatch(deleteFollowUpRule(ruleId));
        }
    };
    if (loading) {
        return _jsx("div", { children: t('common.loading') });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    return (_jsxs(Container, { children: [_jsx(Title, { children: t('notifications.followUp.title') }), _jsx(RuleList, { children: rules.map((rule) => (_jsxs(RuleCard, { active: rule.isActive, children: [_jsxs(RuleHeader, { children: [_jsx(RuleName, { children: rule.name }), _jsx(ToggleButton, { active: rule.isActive, onClick: () => handleToggle(rule.id), children: rule.isActive ? t('common.active') : t('common.inactive') })] }), _jsxs(RuleContent, { children: [_jsx(RuleLabel, { children: t('notifications.followUp.conditions') }), _jsxs(RuleValue, { children: [t('notifications.followUp.responseType'), ": ", rule.conditions.responseType, _jsx("br", {}), t('notifications.followUp.timeSinceNotification'), ":", ' ', rule.conditions.timeSinceNotification, "h", _jsx("br", {}), t('notifications.followUp.priority'), ": ", rule.conditions.priority] }), _jsx(RuleLabel, { children: t('notifications.followUp.actions') }), _jsxs(RuleValue, { children: [t('notifications.followUp.channel'), ": ", rule.actions.channel, _jsx("br", {}), t('notifications.followUp.delay'), ": ", rule.actions.delay, "h", _jsx("br", {}), t('notifications.followUp.maxRetries'), ": ", rule.actions.maxRetries] })] }), _jsxs(ActionButtons, { children: [_jsx(Button, { onClick: () => handleToggle(rule.id), children: rule.isActive ? t('common.deactivate') : t('common.activate') }), _jsx(DeleteButton, { onClick: () => handleDelete(rule.id), children: t('common.delete') })] })] }, rule.id))) }), _jsxs(Form, { onSubmit: handleSubmit, children: [_jsx("h3", { children: t('notifications.followUp.createRule') }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.followUp.ruleName') }), _jsx(Input, { type: "text", name: "name", value: newRule.name, onChange: handleInputChange, required: true })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.followUp.responseType') }), _jsxs(Select, { name: "conditions.responseType", value: newRule.conditions.responseType, onChange: handleInputChange, children: [_jsx("option", { value: "ignore", children: t('notifications.followUp.ignore') }), _jsx("option", { value: "dismiss", children: t('notifications.followUp.dismiss') })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.followUp.timeSinceNotification') }), _jsx(Input, { type: "number", name: "conditions.timeSinceNotification", value: newRule.conditions.timeSinceNotification, onChange: handleInputChange, min: "1", required: true })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.followUp.priority') }), _jsxs(Select, { name: "conditions.priority", value: newRule.conditions.priority, onChange: handleInputChange, children: [_jsx("option", { value: "low", children: t('notifications.followUp.low') }), _jsx("option", { value: "medium", children: t('notifications.followUp.medium') }), _jsx("option", { value: "high", children: t('notifications.followUp.high') })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.followUp.channel') }), _jsx(Select, { name: "actions.channel", value: newRule.actions.channel, onChange: handleInputChange, children: Object.values(NotificationChannel).map(channel => (_jsx("option", { value: channel, children: channel }, channel))) })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.followUp.delay') }), _jsx(Input, { type: "number", name: "actions.delay", value: newRule.actions.delay, onChange: handleInputChange, min: "1", required: true })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.followUp.maxRetries') }), _jsx(Input, { type: "number", name: "actions.maxRetries", value: newRule.actions.maxRetries, onChange: handleInputChange, min: "1", required: true })] }), _jsx(Button, { type: "submit", children: t('notifications.followUp.create') })] })] }));
};
export default FollowUpAutomation;
