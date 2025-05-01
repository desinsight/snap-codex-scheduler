import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  fetchResponses,
  fetchFollowUps,
  fetchChannelTemplates,
  fetchChannelStatuses,
  fetchChannelSwitchRules,
  createChannelTemplate,
  updateChannelTemplate,
  createChannelSwitchRule,
  updateChannelSwitchRule,
  scheduleFollowUp,
} from '../../store/slices/notificationResponseSlice';
import { RootState } from '../../store';
import {
  NotificationChannel,
  ChannelTemplate,
  ChannelStatus,
  ChannelSwitchRule,
  FollowUpNotification,
} from '../../types/notification';

const TrackerContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: #333;
`;

const Section = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eee;
`;

const CardTitle = styled.h3`
  margin-bottom: 10px;
  color: #333;
`;

const Stat = styled.div`
  margin-bottom: 8px;
`;

const StatLabel = styled.span`
  color: #666;
  margin-right: 5px;
`;

const StatValue = styled.span`
  font-weight: bold;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #666;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
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

const StatusIndicator = styled.span<{ status: string }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
  background-color: ${(props) => {
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

const NotificationResponseTracker: React.FC = () => {
  const { t } = useTranslation('schedule');
  const dispatch = useDispatch();
  const {
    responses,
    followUps,
    channelTemplates,
    channelStatuses,
    channelSwitchRules,
    loading,
    error,
  } = useSelector((state: RootState) => state.notificationResponse);

  const [newTemplate, setNewTemplate] = useState<Omit<ChannelTemplate, 'id'>>({
    channel: 'email',
    name: '',
    content: '',
    variables: [],
    isDefault: false,
    priority: 'medium',
  });

  const [newRule, setNewRule] = useState<Omit<ChannelSwitchRule, 'id'>>({
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

  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTemplate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRuleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('conditions.')) {
      const conditionName = name.split('.')[1];
      setNewRule((prev) => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          [conditionName]: value,
        },
      }));
    } else {
      setNewRule((prev) => ({
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
    return <div>{t('loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <TrackerContainer>
      <Title>{t('notifications.response.title')}</Title>

      <Section>
        <SectionTitle>{t('notifications.response.channelStatus')}</SectionTitle>
        <Grid>
          {channelStatuses.map((status) => (
            <Card key={status.channel}>
              <CardTitle>{status.channel}</CardTitle>
              <Stat>
                <StatusIndicator status={status.status} />
                {status.status}
              </Stat>
              <Stat>
                <StatLabel>{t('notifications.response.successRate')}:</StatLabel>
                <StatValue>{(status.metrics.successRate * 100).toFixed(1)}%</StatValue>
              </Stat>
              <Stat>
                <StatLabel>{t('notifications.response.totalSent')}:</StatLabel>
                <StatValue>{status.metrics.totalSent}</StatValue>
              </Stat>
              <Stat>
                <StatLabel>{t('notifications.response.totalFailed')}:</StatLabel>
                <StatValue>{status.metrics.totalFailed}</StatValue>
              </Stat>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionTitle>{t('notifications.response.channelTemplates')}</SectionTitle>
        <FormGroup>
          <Label>{t('notifications.response.channel')}</Label>
          <Select name="channel" value={newTemplate.channel} onChange={handleTemplateChange}>
            {Object.values(NotificationChannel).map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>{t('notifications.response.templateName')}</Label>
          <Input
            type="text"
            name="name"
            value={newTemplate.name}
            onChange={handleTemplateChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>{t('notifications.response.templateContent')}</Label>
          <Input
            type="text"
            name="content"
            value={newTemplate.content}
            onChange={handleTemplateChange}
          />
        </FormGroup>
        <Button onClick={handleCreateTemplate} disabled={loading}>
          {t('notifications.response.createTemplate')}
        </Button>
      </Section>

      <Section>
        <SectionTitle>{t('notifications.response.channelSwitchRules')}</SectionTitle>
        <FormGroup>
          <Label>{t('notifications.response.sourceChannel')}</Label>
          <Select name="sourceChannel" value={newRule.sourceChannel} onChange={handleRuleChange}>
            {Object.values(NotificationChannel).map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>{t('notifications.response.targetChannel')}</Label>
          <Select name="targetChannel" value={newRule.targetChannel} onChange={handleRuleChange}>
            {Object.values(NotificationChannel).map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>{t('notifications.response.failureCount')}</Label>
          <Input
            type="number"
            name="conditions.failureCount"
            value={newRule.conditions.failureCount}
            onChange={handleRuleChange}
            min="1"
          />
        </FormGroup>
        <FormGroup>
          <Label>{t('notifications.response.timeSinceLastAttempt')}</Label>
          <Input
            type="number"
            name="conditions.timeSinceLastAttempt"
            value={newRule.conditions.timeSinceLastAttempt}
            onChange={handleRuleChange}
            min="1"
          />
        </FormGroup>
        <Button onClick={handleCreateRule} disabled={loading}>
          {t('notifications.response.createRule')}
        </Button>
      </Section>
    </TrackerContainer>
  );
};

export default NotificationResponseTracker; 