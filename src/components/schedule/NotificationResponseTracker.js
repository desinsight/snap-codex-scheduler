import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { fetchResponses, fetchFollowUps, fetchChannelTemplates, fetchChannelStatuses, fetchChannelSwitchRules, createChannelTemplate, createChannelSwitchRule, } from '../../store/slices/notificationResponseSlice';
const TrackerContainer = styled.div `
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;
const Title = styled.h1 `
  margin-bottom: 20px;
  color: #333;
`;
const Section = styled.div `
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;
const SectionTitle = styled.h2 `
  margin-bottom: 20px;
  color: #333;
`;
const Grid = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;
const Card = styled.div `
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eee;
`;
const CardTitle = styled.h3 `
  margin-bottom: 10px;
  color: #333;
`;
const Stat = styled.div `
  margin-bottom: 8px;
`;
const StatLabel = styled.span `
  color: #666;
  margin-right: 5px;
`;
const StatValue = styled.span `
  font-weight: bold;
  color: #333;
`;
const FormGroup = styled.div `
  margin-bottom: 20px;
`;
const Label = styled.label `
  display: block;
  margin-bottom: 8px;
  color: #666;
`;
const Input = styled.input `
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;
const Select = styled.select `
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;
const Button = styled.button `
  padding: 10px 20px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #40a9ff;
  }

  &:disabled {
    background-color: #d9d9d9;
    cursor: not-allowed;
  }
`;
const StatusIndicator = styled.span `
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
  background-color: ${props => {
    switch (props.status) {
        case 'active':
            return '#52c41a';
        case 'inactive':
            return '#d9d9d9';
        case 'error':
            return '#ff4d4f';
        default:
            return '#d9d9d9';
    }
}};
`;
const NotificationResponseTracker = () => {
    const { t } = useTranslation('schedule');
    const dispatch = useDispatch();
    const { responses, followUps, channelTemplates, channelStatuses, channelSwitchRules, loading, error, } = useSelector((state) => state.notificationResponse);
    const [newTemplate, setNewTemplate] = useState({
        channel: 'email',
        name: '',
        content: '',
        variables: [],
        isDefault: false,
        priority: 'medium',
    });
    const [newRule, setNewRule] = useState({
        sourceChannel: 'email',
        targetChannel: 'sms',
        conditions: {
            failureCount: 2,
            timeSinceLastAttempt: 30,
            priority: 'medium',
        },
        isActive: true,
    });
    useEffect(() => {
        dispatch(fetchResponses());
        dispatch(fetchFollowUps());
        dispatch(fetchChannelTemplates());
        dispatch(fetchChannelStatuses());
        dispatch(fetchChannelSwitchRules());
    }, [dispatch]);
    const handleTemplateChange = (e) => {
        const { name, value } = e.target;
        setNewTemplate(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleRuleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('conditions.')) {
            const conditionName = name.split('.')[1];
            setNewRule(prev => ({
                ...prev,
                conditions: {
                    ...prev.conditions,
                    [conditionName]: value,
                },
            }));
        }
        else {
            setNewRule(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    const handleCreateTemplate = () => {
        dispatch(createChannelTemplate(newTemplate));
        setNewTemplate({
            channel: 'email',
            name: '',
            content: '',
            variables: [],
            isDefault: false,
            priority: 'medium',
        });
    };
    const handleCreateRule = () => {
        dispatch(createChannelSwitchRule(newRule));
        setNewRule({
            sourceChannel: 'email',
            targetChannel: 'sms',
            conditions: {
                failureCount: 2,
                timeSinceLastAttempt: 30,
                priority: 'medium',
            },
            isActive: true,
        });
    };
    if (loading) {
        return _jsx("div", { children: t('loading') });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    return (_jsxs(TrackerContainer, { children: [_jsx(Title, { children: t('notifications.response.title') }), _jsxs(Section, { children: [_jsx(SectionTitle, { children: t('notifications.response.channelStatus') }), _jsx(Grid, { children: channelStatuses.map(status => (_jsxs(Card, { children: [_jsx(CardTitle, { children: status.channel }), _jsxs(Stat, { children: [_jsx(StatusIndicator, { status: status.status }), status.status] }), _jsxs(Stat, { children: [_jsxs(StatLabel, { children: [t('notifications.response.successRate'), ":"] }), _jsxs(StatValue, { children: [(status.metrics.successRate * 100).toFixed(1), "%"] })] }), _jsxs(Stat, { children: [_jsxs(StatLabel, { children: [t('notifications.response.totalSent'), ":"] }), _jsx(StatValue, { children: status.metrics.totalSent })] }), _jsxs(Stat, { children: [_jsxs(StatLabel, { children: [t('notifications.response.totalFailed'), ":"] }), _jsx(StatValue, { children: status.metrics.totalFailed })] })] }, status.channel))) })] }), _jsxs(Section, { children: [_jsx(SectionTitle, { children: t('notifications.response.channelTemplates') }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.response.channel') }), _jsx(Select, { name: "channel", value: newTemplate.channel, onChange: handleTemplateChange, children: Object.values(NotificationChannel).map(channel => (_jsx("option", { value: channel, children: channel }, channel))) })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.response.templateName') }), _jsx(Input, { type: "text", name: "name", value: newTemplate.name, onChange: handleTemplateChange })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.response.templateContent') }), _jsx(Input, { type: "text", name: "content", value: newTemplate.content, onChange: handleTemplateChange })] }), _jsx(Button, { onClick: handleCreateTemplate, disabled: loading, children: t('notifications.response.createTemplate') })] }), _jsxs(Section, { children: [_jsx(SectionTitle, { children: t('notifications.response.channelSwitchRules') }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.response.sourceChannel') }), _jsx(Select, { name: "sourceChannel", value: newRule.sourceChannel, onChange: handleRuleChange, children: Object.values(NotificationChannel).map(channel => (_jsx("option", { value: channel, children: channel }, channel))) })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.response.targetChannel') }), _jsx(Select, { name: "targetChannel", value: newRule.targetChannel, onChange: handleRuleChange, children: Object.values(NotificationChannel).map(channel => (_jsx("option", { value: channel, children: channel }, channel))) })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.response.failureCount') }), _jsx(Input, { type: "number", name: "conditions.failureCount", value: newRule.conditions.failureCount, onChange: handleRuleChange, min: "1" })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.response.timeSinceLastAttempt') }), _jsx(Input, { type: "number", name: "conditions.timeSinceLastAttempt", value: newRule.conditions.timeSinceLastAttempt, onChange: handleRuleChange, min: "1" })] }), _jsx(Button, { onClick: handleCreateRule, disabled: loading, children: t('notifications.response.createRule') })] })] }));
};
export default NotificationResponseTracker;
