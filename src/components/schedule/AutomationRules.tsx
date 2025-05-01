import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  fetchAutomationRules,
  createAutomationRule,
  updateAutomationRule,
  deleteAutomationRule,
  toggleAutomationRule,
} from '../../store/slices/automationSlice';
import { AutomationRule } from '../../types/notification';

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

const RuleCard = styled.div`
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
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

const RuleType = styled.span`
  font-size: 0.9em;
  color: #666;
`;

const RuleConditions = styled.div`
  margin-bottom: 10px;
`;

const RuleActions = styled.div`
  margin-bottom: 10px;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  background: ${(props) => (props.active ? '#4CAF50' : '#f44336')};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
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

const Button = styled.button`
  background: #2196F3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
`;

const AutomationRules: React.FC = () => {
  const { t } = useTranslation('schedule');
  const dispatch = useDispatch();
  const { rules, loading, error } = useSelector((state: any) => state.automation);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    name: '',
    type: 'channelSwitch',
    conditions: [],
    actions: [],
    isActive: true,
  });

  useEffect(() => {
    dispatch(fetchAutomationRules());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRule((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createAutomationRule(newRule as Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>));
    setNewRule({
      name: '',
      type: 'channelSwitch',
      conditions: [],
      actions: [],
      isActive: true,
    });
  };

  const handleToggle = (ruleId: string) => {
    dispatch(toggleAutomationRule(ruleId));
  };

  const handleDelete = (ruleId: string) => {
    if (window.confirm(t('notifications.automation.confirmDelete'))) {
      dispatch(deleteAutomationRule(ruleId));
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
      <Title>{t('notifications.automation.title')}</Title>
      <RuleList>
        {rules.map((rule: AutomationRule) => (
          <RuleCard key={rule.id}>
            <RuleHeader>
              <RuleName>{rule.name}</RuleName>
              <ToggleButton
                active={rule.isActive}
                onClick={() => handleToggle(rule.id)}
              >
                {rule.isActive ? t('notifications.automation.deactivate') : t('notifications.automation.activate')}
              </ToggleButton>
            </RuleHeader>
            <RuleType>{t(`notifications.automation.types.${rule.type}`)}</RuleType>
            <RuleConditions>
              <h4>{t('notifications.automation.conditions')}</h4>
              {rule.conditions.map((condition, index) => (
                <div key={index}>
                  {condition.metric} {condition.operator} {condition.value}
                </div>
              ))}
            </RuleConditions>
            <RuleActions>
              <h4>{t('notifications.automation.actions')}</h4>
              {rule.actions.map((action, index) => (
                <div key={index}>
                  {action.type}: {JSON.stringify(action.value)}
                </div>
              ))}
            </RuleActions>
            <Button onClick={() => handleDelete(rule.id)}>
              {t('notifications.automation.delete')}
            </Button>
          </RuleCard>
        ))}
      </RuleList>
      <Form onSubmit={handleSubmit}>
        <h3>{t('notifications.automation.createRule')}</h3>
        <FormGroup>
          <Label>{t('notifications.automation.name')}</Label>
          <Input
            type="text"
            name="name"
            value={newRule.name}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>{t('notifications.automation.type')}</Label>
          <Select
            name="type"
            value={newRule.type}
            onChange={handleInputChange}
            required
          >
            <option value="channelSwitch">{t('notifications.automation.types.channelSwitch')}</option>
            <option value="priorityAdjustment">{t('notifications.automation.types.priorityAdjustment')}</option>
            <option value="retryStrategy">{t('notifications.automation.types.retryStrategy')}</option>
            <option value="fatigueManagement">{t('notifications.automation.types.fatigueManagement')}</option>
          </Select>
        </FormGroup>
        <Button type="submit">{t('notifications.automation.create')}</Button>
      </Form>
    </Container>
  );
};

export default AutomationRules; 