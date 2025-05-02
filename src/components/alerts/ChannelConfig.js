import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AlertService } from '../../services/AlertService';
const Container = styled.div `
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;
const Title = styled.h2 `
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;
const Form = styled.form `
  display: flex;
  flex-direction: column;
  gap: 15px;
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
const TextArea = styled.textarea `
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100px;
  font-family: monospace;
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
const ButtonGroup = styled.div `
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;
const StatusMessage = styled.div `
  padding: 10px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme, isError }) => isError ? theme.colors.error : theme.colors.success};
  color: white;
  margin-top: 10px;
`;
const ChannelConfig = ({ channel }) => {
    const { t } = useTranslation();
    const [config, setConfig] = useState({});
    const [status, setStatus] = useState(null);
    const alertService = AlertService.getInstance();
    useEffect(() => {
        loadConfig();
    }, [channel]);
    const loadConfig = async () => {
        try {
            const currentConfig = await alertService.getChannelConfig(channel);
            if (currentConfig) {
                setConfig(currentConfig);
            }
        }
        catch (error) {
            console.error('Failed to load channel config:', error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await alertService.setChannelConfig(channel, config);
            setStatus({ message: t('alerts.channel.saveSuccess'), isError: false });
        }
        catch (error) {
            setStatus({ message: t('alerts.channel.saveError'), isError: true });
        }
    };
    const handleTest = async () => {
        try {
            const success = await alertService.testChannel(channel);
            setStatus({
                message: success ? t('alerts.channel.testSuccess') : t('alerts.channel.testError'),
                isError: !success
            });
        }
        catch (error) {
            setStatus({ message: t('alerts.channel.testError'), isError: true });
        }
    };
    const renderEmailConfig = () => (_jsxs(_Fragment, { children: [_jsxs(FormGroup, { children: [_jsx(Label, { children: t('alerts.channel.email.recipients') }), _jsx(TextArea, { value: config.email?.recipients.join('\n') || '', onChange: e => setConfig(prev => ({
                            ...prev,
                            email: {
                                ...prev.email,
                                recipients: e.target.value.split('\n').filter(r => r.trim())
                            }
                        })), placeholder: t('alerts.channel.email.recipientsPlaceholder') })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('alerts.channel.email.templateId') }), _jsx(Input, { type: "text", value: config.email?.templateId || '', onChange: e => setConfig(prev => ({
                            ...prev,
                            email: {
                                ...prev.email,
                                templateId: e.target.value
                            }
                        })), placeholder: t('alerts.channel.email.templateIdPlaceholder') })] })] }));
    const renderSlackConfig = () => (_jsxs(_Fragment, { children: [_jsxs(FormGroup, { children: [_jsx(Label, { children: t('alerts.channel.slack.webhookUrl') }), _jsx(Input, { type: "text", value: config.slack?.webhookUrl || '', onChange: e => setConfig(prev => ({
                            ...prev,
                            slack: {
                                ...prev.slack,
                                webhookUrl: e.target.value
                            }
                        })), placeholder: t('alerts.channel.slack.webhookUrlPlaceholder') })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('alerts.channel.slack.channel') }), _jsx(Input, { type: "text", value: config.slack?.channel || '', onChange: e => setConfig(prev => ({
                            ...prev,
                            slack: {
                                ...prev.slack,
                                channel: e.target.value
                            }
                        })), placeholder: t('alerts.channel.slack.channelPlaceholder') })] })] }));
    const renderWebhookConfig = () => (_jsxs(_Fragment, { children: [_jsxs(FormGroup, { children: [_jsx(Label, { children: t('alerts.channel.webhook.url') }), _jsx(Input, { type: "text", value: config.webhook?.url || '', onChange: e => setConfig(prev => ({
                            ...prev,
                            webhook: {
                                ...prev.webhook,
                                url: e.target.value
                            }
                        })), placeholder: t('alerts.channel.webhook.urlPlaceholder') })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('alerts.channel.webhook.headers') }), _jsx(TextArea, { value: config.webhook?.headers ? JSON.stringify(config.webhook.headers, null, 2) : '', onChange: e => {
                            try {
                                const headers = JSON.parse(e.target.value);
                                setConfig(prev => ({
                                    ...prev,
                                    webhook: {
                                        ...prev.webhook,
                                        headers
                                    }
                                }));
                            }
                            catch (error) {
                                // Invalid JSON, ignore
                            }
                        }, placeholder: t('alerts.channel.webhook.headersPlaceholder') })] })] }));
    return (_jsxs(Container, { children: [_jsx(Title, { children: t(`alerts.channel.${channel}.title`) }), _jsxs(Form, { onSubmit: handleSubmit, children: [channel === 'email' && renderEmailConfig(), channel === 'slack' && renderSlackConfig(), channel === 'webhook' && renderWebhookConfig(), _jsxs(ButtonGroup, { children: [_jsx(Button, { type: "button", variant: "secondary", onClick: handleTest, children: t('alerts.channel.test') }), _jsx(Button, { type: "submit", children: t('common.save') })] }), status && (_jsx(StatusMessage, { isError: status.isError, children: status.message }))] })] }));
};
export default ChannelConfig;
