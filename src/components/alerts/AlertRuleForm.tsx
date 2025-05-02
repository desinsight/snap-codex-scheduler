import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AlertRule, AlertThreshold, AlertPriority, AlertChannel } from '../../types/alerts';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
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
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const ThresholdGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme, variant }) =>
    variant === 'secondary' ? theme.colors.secondary : theme.colors.primary};
  color: white;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const ChannelConfig = styled.div`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-top: 10px;
`;

interface Props {
  initialRule?: AlertRule;
  onSubmit: (rule: AlertRule) => void;
}

const AlertRuleForm: React.FC<Props> = ({ initialRule, onSubmit }) => {
  const { t } = useTranslation();
  const [rule, setRule] = useState<Partial<AlertRule>>(
    initialRule || {
      name: '',
      description: '',
      priority: 'medium',
      thresholds: [],
      channels: [],
      enabled: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidRule(rule)) {
      onSubmit(rule as AlertRule);
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

  const updateThreshold = (index: number, threshold: Partial<AlertThreshold>) => {
    setRule(prev => ({
      ...prev,
      thresholds: prev.thresholds?.map((t, i) =>
        i === index ? { ...t, ...threshold } : t
      ),
    }));
  };

  const removeThreshold = (index: number) => {
    setRule(prev => ({
      ...prev,
      thresholds: prev.thresholds?.filter((_, i) => i !== index),
    }));
  };

  const toggleChannel = (channel: AlertChannel) => {
    setRule(prev => ({
      ...prev,
      channels: prev.channels?.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...(prev.channels || []), channel],
    }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>{t('alerts.rule.name')}</Label>
        <Input
          type="text"
          value={rule.name}
          onChange={e => setRule(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>{t('alerts.rule.description')}</Label>
        <Input
          type="text"
          value={rule.description}
          onChange={e => setRule(prev => ({ ...prev, description: e.target.value }))}
        />
      </FormGroup>

      <FormGroup>
        <Label>{t('alerts.rule.priority')}</Label>
        <Select
          value={rule.priority}
          onChange={e => setRule(prev => ({ ...prev, priority: e.target.value as AlertPriority }))}
        >
          <option value="low">{t('alerts.priority.low')}</option>
          <option value="medium">{t('alerts.priority.medium')}</option>
          <option value="high">{t('alerts.priority.high')}</option>
          <option value="critical">{t('alerts.priority.critical')}</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>{t('alerts.rule.thresholds')}</Label>
        {rule.thresholds?.map((threshold, index) => (
          <ThresholdGroup key={index}>
            <Select
              value={threshold.metric}
              onChange={e => updateThreshold(index, { metric: e.target.value })}
            >
              <option value="">{t('alerts.threshold.selectMetric')}</option>
              <option value="cpu">CPU Usage</option>
              <option value="memory">Memory Usage</option>
              <option value="errorRate">Error Rate</option>
              <option value="latency">Latency</option>
            </Select>
            <Select
              value={threshold.operator}
              onChange={e => updateThreshold(index, { operator: e.target.value as '>' | '<' })}
            >
              <option value=">">&gt;</option>
              <option value=">=">&gt;=</option>
              <option value="<">&lt;</option>
              <option value="<=">&lt;=</option>
              <option value="==">=</option>
            </Select>
            <Input
              type="number"
              value={threshold.value}
              onChange={e => updateThreshold(index, { value: Number(e.target.value) })}
              style={{ width: '100px' }}
            />
            <Input
              type="number"
              value={threshold.duration}
              onChange={e => updateThreshold(index, { duration: Number(e.target.value) })}
              placeholder={t('alerts.threshold.duration')}
              style={{ width: '100px' }}
            />
            <Button type="button" variant="secondary" onClick={() => removeThreshold(index)}>
              {t('common.remove')}
            </Button>
          </ThresholdGroup>
        ))}
        <Button type="button" onClick={addThreshold}>
          {t('alerts.threshold.add')}
        </Button>
      </FormGroup>

      <FormGroup>
        <Label>{t('alerts.rule.channels')}</Label>
        <div>
          <label>
            <input
              type="checkbox"
              checked={rule.channels?.includes('email')}
              onChange={() => toggleChannel('email')}
            />
            Email
          </label>
          <label>
            <input
              type="checkbox"
              checked={rule.channels?.includes('slack')}
              onChange={() => toggleChannel('slack')}
            />
            Slack
          </label>
          <label>
            <input
              type="checkbox"
              checked={rule.channels?.includes('webhook')}
              onChange={() => toggleChannel('webhook')}
            />
            Webhook
          </label>
          <label>
            <input
              type="checkbox"
              checked={rule.channels?.includes('inApp')}
              onChange={() => toggleChannel('inApp')}
            />
            In-App
          </label>
        </div>
      </FormGroup>

      <Button type="submit">{t('common.save')}</Button>
    </Form>
  );
};

const isValidRule = (rule: Partial<AlertRule>): rule is AlertRule => {
  return !!(
    rule.name &&
    rule.priority &&
    rule.thresholds?.length &&
    rule.channels?.length
  );
};

export default AlertRuleForm; 