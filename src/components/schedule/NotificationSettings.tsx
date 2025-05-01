import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { RootState } from '../../store';
import {
  fetchNotificationSettings,
  updateNotificationSettings,
} from '../../store/slices/notificationSlice';
import {
  NotificationSettings as NotificationSettingsType,
  NotificationType,
  NotificationTime,
} from '../../types/notification';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const SettingItem = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const Select = styled.select`
  margin-left: 10px;
  padding: 5px;
`;

interface NotificationSettingsProps {
  scheduleId: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ scheduleId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('schedule');
  const { settings, loading, error } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotificationSettings(scheduleId));
  }, [dispatch, scheduleId]);

  const handleSettingChange = async (setting: NotificationSettingsType) => {
    await dispatch(updateNotificationSettings(setting));
  };

  if (loading) {
    return <div>{t('notifications.loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const notificationTypes: NotificationType[] = ['email', 'browser'];
  const notificationTimes: NotificationTime[] = ['5', '10', '15', '30', '60', '120', '1440'];

  return (
    <Container>
      <Title>{t('notifications.title')}</Title>
      {notificationTypes.map(type => {
        const setting = settings.find(s => s.type === type) || {
          id: '',
          scheduleId,
          type,
          time: '10',
          enabled: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        return (
          <SettingItem key={type}>
            <Label>
              <Checkbox
                type="checkbox"
                checked={setting.enabled}
                onChange={e =>
                  handleSettingChange({
                    ...setting,
                    enabled: e.target.checked,
                  })
                }
              />
              {t(`notifications.types.${type}`)}
              {setting.enabled && (
                <Select
                  value={setting.time}
                  onChange={e =>
                    handleSettingChange({
                      ...setting,
                      time: e.target.value as NotificationTime,
                    })
                  }
                >
                  {notificationTimes.map(time => (
                    <option key={time} value={time}>
                      {t(`notifications.times.${time}`)}
                    </option>
                  ))}
                </Select>
              )}
            </Label>
          </SettingItem>
        );
      })}
    </Container>
  );
};

export default NotificationSettings;
