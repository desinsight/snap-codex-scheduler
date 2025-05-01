import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  fetchChannelMetrics,
  fetchOptimizationRules,
  createOptimizationRule,
  updateOptimizationRule,
  deleteOptimizationRule,
  toggleOptimizationRule,
} from '../../store/slices/channelOptimizationSlice';
import { ChannelOptimizationRule, NotificationChannel } from '../../types/notification';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const MetricCard = styled.div`
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const MetricTitle = styled.h3`
  margin: 0;
`;

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const MetricLabel = styled.div`
  color: #666;
`;

const RuleList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const RuleCard = styled.div<{ active: boolean }>`
  background: ${({ active }) => (active ? '#f0f8ff' : '#f5f5f5')};
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  position: relative;
`;

const RuleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const RuleName = styled.h3`
  margin: 0;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  background: ${({ active }) => (active ? '#4caf50' : '#f44336')};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
`;

const RuleContent = styled.div`
  margin-bottom: 10px;
`;

const RuleLabel = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const RuleValue = styled.div`
  margin-bottom: 10px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
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

const DeleteButton = styled(Button)`
  background: #f44336;

  &:hover {
    background: #d32f2f;
  }
`;

const Form = styled.form`
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ChannelOptimization: React.FC = () => {
  const { t } = useTranslation('schedule');
  const dispatch = useDispatch();
  const { metrics, rules, loading, error } = useSelector((state: any) => state.channelOptimization);

  const [newRule, setNewRule] = useState<
    Omit<ChannelOptimizationRule, 'id' | 'createdAt' | 'updatedAt'>
  >({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    } else if (name.startsWith('conditions.timeRange.')) {
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
    } else if (name.startsWith('actions.')) {
      const field = name.split('.')[1];
      setNewRule({
        ...newRule,
        actions: {
          ...newRule.actions,
          [field]: value === 'true' ? true : value === 'false' ? false : value,
        },
      });
    } else {
      setNewRule({
        ...newRule,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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

  const handleToggle = (ruleId: string) => {
    dispatch(toggleOptimizationRule(ruleId));
  };

  const handleDelete = (ruleId: string) => {
    if (window.confirm(t('notifications.optimization.confirmDelete'))) {
      dispatch(deleteOptimizationRule(ruleId));
    }
  };

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <Title>{t('notifications.optimization.title')}</Title>

      <MetricsGrid>
        {metrics.map(metric => (
          <MetricCard key={metric.channel}>
            <MetricHeader>
              <MetricTitle>{metric.channel}</MetricTitle>
            </MetricHeader>
            <MetricValue>{metric.successRate}%</MetricValue>
            <MetricLabel>{t('notifications.optimization.successRate')}</MetricLabel>
            <MetricValue>{metric.averageDeliveryTime}s</MetricValue>
            <MetricLabel>{t('notifications.optimization.averageDeliveryTime')}</MetricLabel>
            <MetricValue>{metric.totalSent}</MetricValue>
            <MetricLabel>{t('notifications.optimization.totalSent')}</MetricLabel>
            <MetricValue>{metric.totalFailed}</MetricValue>
            <MetricLabel>{t('notifications.optimization.totalFailed')}</MetricLabel>
          </MetricCard>
        ))}
      </MetricsGrid>

      <RuleList>
        {rules.map((rule: ChannelOptimizationRule) => (
          <RuleCard key={rule.id} active={rule.isActive}>
            <RuleHeader>
              <RuleName>{rule.channel}</RuleName>
              <ToggleButton active={rule.isActive} onClick={() => handleToggle(rule.id)}>
                {rule.isActive ? t('common.active') : t('common.inactive')}
              </ToggleButton>
            </RuleHeader>

            <RuleContent>
              <RuleLabel>{t('notifications.optimization.conditions')}</RuleLabel>
              <RuleValue>
                {t('notifications.optimization.minSuccessRate')}: {rule.conditions.minSuccessRate}%
                <br />
                {t('notifications.optimization.maxDeliveryTime')}: {rule.conditions.maxDeliveryTime}
                s
                <br />
                {t('notifications.optimization.timeRange')}: {rule.conditions.timeRange.start}h -{' '}
                {rule.conditions.timeRange.end}h
              </RuleValue>

              <RuleLabel>{t('notifications.optimization.actions')}</RuleLabel>
              <RuleValue>
                {t('notifications.optimization.adjustPriority')}:{' '}
                {rule.actions.adjustPriority ? t('common.yes') : t('common.no')}
                <br />
                {rule.actions.switchChannel &&
                  `${t('notifications.optimization.switchTo')}: ${rule.actions.switchChannel}`}
                {rule.actions.delayTime &&
                  `${t('notifications.optimization.delayTime')}: ${rule.actions.delayTime}s`}
              </RuleValue>
            </RuleContent>

            <ActionButtons>
              <Button onClick={() => handleToggle(rule.id)}>
                {rule.isActive ? t('common.deactivate') : t('common.activate')}
              </Button>
              <DeleteButton onClick={() => handleDelete(rule.id)}>
                {t('common.delete')}
              </DeleteButton>
            </ActionButtons>
          </RuleCard>
        ))}
      </RuleList>

      <Form onSubmit={handleSubmit}>
        <h3>{t('notifications.optimization.createRule')}</h3>

        <FormGroup>
          <Label>{t('notifications.optimization.channel')}</Label>
          <Select name="channel" value={newRule.channel} onChange={handleInputChange}>
            {Object.values(NotificationChannel).map(channel => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>{t('notifications.optimization.minSuccessRate')}</Label>
          <Input
            type="number"
            name="conditions.minSuccessRate"
            value={newRule.conditions.minSuccessRate}
            onChange={handleInputChange}
            min="0"
            max="100"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('notifications.optimization.maxDeliveryTime')}</Label>
          <Input
            type="number"
            name="conditions.maxDeliveryTime"
            value={newRule.conditions.maxDeliveryTime}
            onChange={handleInputChange}
            min="0"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('notifications.optimization.timeRange')}</Label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Input
              type="number"
              name="conditions.timeRange.start"
              value={newRule.conditions.timeRange.start}
              onChange={handleInputChange}
              min="0"
              max="23"
              required
            />
            <Input
              type="number"
              name="conditions.timeRange.end"
              value={newRule.conditions.timeRange.end}
              onChange={handleInputChange}
              min="1"
              max="24"
              required
            />
          </div>
        </FormGroup>

        <FormGroup>
          <Label>{t('notifications.optimization.adjustPriority')}</Label>
          <Select
            name="actions.adjustPriority"
            value={newRule.actions.adjustPriority.toString()}
            onChange={handleInputChange}
          >
            <option value="true">{t('common.yes')}</option>
            <option value="false">{t('common.no')}</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>{t('notifications.optimization.switchChannel')}</Label>
          <Select
            name="actions.switchChannel"
            value={newRule.actions.switchChannel || ''}
            onChange={handleInputChange}
          >
            <option value="">{t('notifications.optimization.none')}</option>
            {Object.values(NotificationChannel).map(channel => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>{t('notifications.optimization.delayTime')}</Label>
          <Input
            type="number"
            name="actions.delayTime"
            value={newRule.actions.delayTime || ''}
            onChange={handleInputChange}
            min="0"
          />
        </FormGroup>

        <Button type="submit">{t('notifications.optimization.create')}</Button>
      </Form>
    </Container>
  );
};

export default ChannelOptimization;
