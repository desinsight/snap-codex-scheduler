import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  updateSmartSettings,
  adjustNotificationTiming,
  updateFatigueSettings,
} from '../../store/slices/notificationAnalyticsSlice';
import { RootState } from '../../store';
import { SmartNotificationSettings, NotificationFatigue } from '../../types/notification';

const OptimizerContainer = styled.div`
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

const UserList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const UserCard = styled.div`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eee;
`;

const UserName = styled.h3`
  margin-bottom: 10px;
  color: #333;
`;

const UserStats = styled.div`
  margin-bottom: 10px;
`;

const StatLabel = styled.span`
  color: #666;
  margin-right: 5px;
`;

const StatValue = styled.span`
  font-weight: bold;
  color: #333;
`;

const SmartNotificationOptimizer: React.FC = () => {
  const { t } = useTranslation('schedule');
  const dispatch = useDispatch();
  const { userPatterns, fatigueLevels, smartSettings, loading, error } = useSelector(
    (state: RootState) => state.notificationAnalytics
  );

  const [selectedUser, setSelectedUser] = useState<string>('');
  const [settings, setSettings] = useState<SmartNotificationSettings>({
    userId: '',
    optimalTimeRange: { start: '09:00', end: '18:00' },
    preferredChannels: [],
    priorityThreshold: 'medium',
    maxDailyNotifications: 5,
  });

  const [fatigue, setFatigue] = useState<NotificationFatigue>({
    userId: '',
    fatigueLevel: 0,
    lastNotificationTime: '',
    notificationCount: 0,
    cooldownPeriod: 30,
  });

  useEffect(() => {
    if (selectedUser) {
      const userSettings = smartSettings.find((s) => s.userId === selectedUser);
      const userFatigue = fatigueLevels.find((f) => f.userId === selectedUser);
      if (userSettings) setSettings(userSettings);
      if (userFatigue) setFatigue(userFatigue);
    }
  }, [selectedUser, smartSettings, fatigueLevels]);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFatigueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFatigue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSettings = () => {
    if (selectedUser) {
      dispatch(updateSmartSettings({ ...settings, userId: selectedUser }));
    }
  };

  const handleSaveFatigue = () => {
    if (selectedUser) {
      dispatch(updateFatigueSettings({ ...fatigue, userId: selectedUser }));
    }
  };

  const handleAdjustTiming = () => {
    if (selectedUser) {
      dispatch(adjustNotificationTiming(selectedUser));
    }
  };

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <OptimizerContainer>
      <Title>{t('notifications.optimizer.title')}</Title>

      <Section>
        <SectionTitle>{t('notifications.optimizer.userSelection')}</SectionTitle>
        <Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">{t('notifications.optimizer.selectUser')}</option>
          {userPatterns.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.userName}
            </option>
          ))}
        </Select>
      </Section>

      {selectedUser && (
        <>
          <Section>
            <SectionTitle>{t('notifications.optimizer.smartSettings')}</SectionTitle>
            <FormGroup>
              <Label>{t('notifications.optimizer.optimalTimeStart')}</Label>
              <Input
                type="time"
                name="optimalTimeRange.start"
                value={settings.optimalTimeRange.start}
                onChange={handleSettingsChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('notifications.optimizer.optimalTimeEnd')}</Label>
              <Input
                type="time"
                name="optimalTimeRange.end"
                value={settings.optimalTimeRange.end}
                onChange={handleSettingsChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('notifications.optimizer.priorityThreshold')}</Label>
              <Select
                name="priorityThreshold"
                value={settings.priorityThreshold}
                onChange={handleSettingsChange}
              >
                <option value="low">{t('notifications.priority.low')}</option>
                <option value="medium">{t('notifications.priority.medium')}</option>
                <option value="high">{t('notifications.priority.high')}</option>
                <option value="urgent">{t('notifications.priority.urgent')}</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>{t('notifications.optimizer.maxDailyNotifications')}</Label>
              <Input
                type="number"
                name="maxDailyNotifications"
                value={settings.maxDailyNotifications}
                onChange={handleSettingsChange}
                min="1"
                max="20"
              />
            </FormGroup>
            <Button onClick={handleSaveSettings} disabled={loading}>
              {t('notifications.optimizer.saveSettings')}
            </Button>
          </Section>

          <Section>
            <SectionTitle>{t('notifications.optimizer.fatigueSettings')}</SectionTitle>
            <FormGroup>
              <Label>{t('notifications.optimizer.fatigueLevel')}</Label>
              <Input
                type="range"
                name="fatigueLevel"
                value={fatigue.fatigueLevel}
                onChange={handleFatigueChange}
                min="0"
                max="100"
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('notifications.optimizer.cooldownPeriod')}</Label>
              <Input
                type="number"
                name="cooldownPeriod"
                value={fatigue.cooldownPeriod}
                onChange={handleFatigueChange}
                min="1"
                max="60"
              />
            </FormGroup>
            <Button onClick={handleSaveFatigue} disabled={loading}>
              {t('notifications.optimizer.saveFatigue')}
            </Button>
          </Section>

          <Section>
            <SectionTitle>{t('notifications.optimizer.actions')}</SectionTitle>
            <Button onClick={handleAdjustTiming} disabled={loading}>
              {t('notifications.optimizer.adjustTiming')}
            </Button>
          </Section>
        </>
      )}
    </OptimizerContainer>
  );
};

export default SmartNotificationOptimizer; 