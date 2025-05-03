import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AlertChannel, AlertChannelConfig } from '../../types/alerts';
import { AlertService } from '../../services/AlertService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.shape.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.shape.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100px;
  font-family: monospace;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.shape.borderRadius.small};
  background-color: ${({ theme, variant }) =>
    variant === 'secondary' ? theme.colors.secondary : theme.colors.primary};
  color: white;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const StatusMessage = styled.div<{ isError?: boolean }>`
  padding: 10px;
  border-radius: ${({ theme }) => theme.shape.borderRadius.small};
  background-color: ${({ theme, isError }) =>
    isError ? theme.colors.error : theme.colors.success};
  color: white;
  margin-top: 10px;
`;

interface Props {
  channel: AlertChannel;
}

const ChannelConfig: React.FC<Props> = ({ channel }) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<AlertChannelConfig>({});
  const [status, setStatus] = useState<{ message: string; isError: boolean } | null>(null);
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
    } catch (error) {
      console.error('Failed to load channel config:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await alertService.setChannelConfig(channel, config);
      setStatus({ message: t('alerts.channel.saveSuccess'), isError: false });
    } catch (error) {
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
    } catch (error) {
      setStatus({ message: t('alerts.channel.testError'), isError: true });
    }
  };

  const renderEmailConfig = () => (
    <>
      <FormGroup>
        <Label>{t('alerts.channel.email.recipients')}</Label>
        <TextArea
          value={config.email?.recipients.join('\n') || ''}
          onChange={e => setConfig(prev => ({
            ...prev,
            email: {
              ...prev.email,
              recipients: e.target.value.split('\n').filter(r => r.trim())
            }
          }))}
          placeholder={t('alerts.channel.email.recipientsPlaceholder')}
        />
      </FormGroup>
      <FormGroup>
        <Label>{t('alerts.channel.email.templateId')}</Label>
        <Input
          type="text"
          value={config.email?.templateId || ''}
          onChange={e => setConfig(prev => ({
            ...prev,
            email: {
              ...prev.email,
              templateId: e.target.value
            }
          }))}
          placeholder={t('alerts.channel.email.templateIdPlaceholder')}
        />
      </FormGroup>
    </>
  );

  const renderSlackConfig = () => (
    <>
      <FormGroup>
        <Label>{t('alerts.channel.slack.webhookUrl')}</Label>
        <Input
          type="text"
          value={config.slack?.webhookUrl || ''}
          onChange={e => setConfig(prev => ({
            ...prev,
            slack: {
              ...prev.slack,
              webhookUrl: e.target.value
            }
          }))}
          placeholder={t('alerts.channel.slack.webhookUrlPlaceholder')}
        />
      </FormGroup>
      <FormGroup>
        <Label>{t('alerts.channel.slack.channel')}</Label>
        <Input
          type="text"
          value={config.slack?.channel || ''}
          onChange={e => setConfig(prev => ({
            ...prev,
            slack: {
              ...prev.slack,
              channel: e.target.value
            }
          }))}
          placeholder={t('alerts.channel.slack.channelPlaceholder')}
        />
      </FormGroup>
    </>
  );

  const renderWebhookConfig = () => (
    <>
      <FormGroup>
        <Label>{t('alerts.channel.webhook.url')}</Label>
        <Input
          type="text"
          value={config.webhook?.url || ''}
          onChange={e => setConfig(prev => ({
            ...prev,
            webhook: {
              ...prev.webhook,
              url: e.target.value
            }
          }))}
          placeholder={t('alerts.channel.webhook.urlPlaceholder')}
        />
      </FormGroup>
      <FormGroup>
        <Label>{t('alerts.channel.webhook.headers')}</Label>
        <TextArea
          value={config.webhook?.headers ? JSON.stringify(config.webhook.headers, null, 2) : ''}
          onChange={e => {
            try {
              const headers = JSON.parse(e.target.value);
              setConfig(prev => ({
                ...prev,
                webhook: {
                  ...prev.webhook,
                  headers
                }
              }));
            } catch (error) {
              // Invalid JSON, ignore
            }
          }}
          placeholder={t('alerts.channel.webhook.headersPlaceholder')}
        />
      </FormGroup>
    </>
  );

  return (
    <Container>
      <Title>{t(`alerts.channel.${channel}.title`)}</Title>
      <Form onSubmit={handleSubmit}>
        {channel === 'email' && renderEmailConfig()}
        {channel === 'slack' && renderSlackConfig()}
        {channel === 'webhook' && renderWebhookConfig()}
        
        <ButtonGroup>
          <Button type="button" variant="secondary" onClick={handleTest}>
            {t('alerts.channel.test')}
          </Button>
          <Button type="submit">
            {t('common.save')}
          </Button>
        </ButtonGroup>

        {status && (
          <StatusMessage isError={status.isError}>
            {status.message}
          </StatusMessage>
        )}
      </Form>
    </Container>
  );
};

export default ChannelConfig; 