import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  fetchFollowUpRules,
  createFollowUpRule,
  updateFollowUpRule,
  deleteFollowUpRule,
  toggleFollowUpRule,
} from '../../store/slices/followUpAutomationSlice';
import { FollowUpRule, NotificationChannel } from '../../types/notification';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
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

const FollowUpAutomation: React.FC = () => {
  const { t } = useTranslation('schedule');
  const dispatch = useDispatch();
  const { rules, loading, error } = useSelector((state: any) => state.followUpAutomation);

  const [newRule, setNewRule] = useState<Omit<FollowUpRule, 'id' | 'createdAt' | 'updatedAt'>>({
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
    } else if (name.startsWith('actions.')) {
      const field = name.split('.')[1];
      setNewRule({
        ...newRule,
        actions: {
          ...newRule.actions,
          [field]: value,
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

  const handleToggle = (ruleId: string) => {
    dispatch(toggleFollowUpRule(ruleId));
  };

  const handleDelete = (ruleId: string) => {
    if (window.confirm(t('notifications.followUp.confirmDelete'))) {
      dispatch(deleteFollowUpRule(ruleId));
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
      <Title>{t('notifications.followUp.title')}</Title>

      <RuleList>
        {rules.map((rule: FollowUpRule) => (
          <RuleCard key={rule.id} active={rule.isActive}>
            <RuleHeader>
              <RuleName>{rule.name}</RuleName>
              <ToggleButton active={rule.isActive} onClick={() => handleToggle(rule.id)}>
                {rule.isActive ? t('common.active') : t('common.inactive')}
              </ToggleButton>
            </RuleHeader>

            <RuleContent>
              <RuleLabel>{t('notifications.followUp.conditions')}</RuleLabel>
              <RuleValue>
                {t('notifications.followUp.responseType')}: {rule.conditions.responseType}
                <br />
                {t('notifications.followUp.timeSinceNotification')}:{' '}
                {rule.conditions.timeSinceNotification}h
                <br />
                {t('notifications.followUp.priority')}: {rule.conditions.priority}
              </RuleValue>

              <RuleLabel>{t('notifications.followUp.actions')}</RuleLabel>
              <RuleValue>
                {t('notifications.followUp.channel')}: {rule.actions.channel}
                <br />
                {t('notifications.followUp.delay')}: {rule.actions.delay}h
                <br />
                {t('notifications.followUp.maxRetries')}: {rule.actions.maxRetries}
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
        <h3>{t('notifications.followUp.createRule')}</h3>

        <FormGroup>
          <Label>{t('notifications.followUp.ruleName')}</Label>
          <Input
            type="text"
            name="name"
            value={newRule.name}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('notifications.followUp.responseType')}</Label>
          <Select
            name="conditions.responseType"
            value={newRule.conditions.responseType}
            onChange={handleInputChange}
          >
            <option value="ignore">{t('notifications.followUp.ignore')}</option>
            <option value="dismiss">{t('notifications.followUp.dismiss')}</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>{t('notifications.followUp.timeSinceNotification')}</Label>
          <Input
            type="number"
            name="conditions.timeSinceNotification"
            value={newRule.conditions.timeSinceNotification}
            onChange={handleInputChange}
            min="1"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('notifications.followUp.priority')}</Label>
          <Select
            name="conditions.priority"
            value={newRule.conditions.priority}
            onChange={handleInputChange}
          >
            <option value="low">{t('notifications.followUp.low')}</option>
            <option value="medium">{t('notifications.followUp.medium')}</option>
            <option value="high">{t('notifications.followUp.high')}</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>{t('notifications.followUp.channel')}</Label>
          <Select
            name="actions.channel"
            value={newRule.actions.channel}
            onChange={handleInputChange}
          >
            {Object.values(NotificationChannel).map(channel => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>{t('notifications.followUp.delay')}</Label>
          <Input
            type="number"
            name="actions.delay"
            value={newRule.actions.delay}
            onChange={handleInputChange}
            min="1"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('notifications.followUp.maxRetries')}</Label>
          <Input
            type="number"
            name="actions.maxRetries"
            value={newRule.actions.maxRetries}
            onChange={handleInputChange}
            min="1"
            required
          />
        </FormGroup>

        <Button type="submit">{t('notifications.followUp.create')}</Button>
      </Form>
    </Container>
  );
};

export default FollowUpAutomation;
