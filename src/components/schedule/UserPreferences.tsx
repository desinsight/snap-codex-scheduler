import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  fetchUserPreferences,
  updateUserPreferences,
  submitFeedback,
} from '../../store/slices/userPreferencesSlice';
import { UserNotificationPreferences, NotificationChannel } from '../../types/notification';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Form = styled.form`
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
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

const Checkbox = styled.input`
  margin-right: 10px;
`;

const Button = styled.button`
  background: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
`;

const FeedbackForm = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
`;

const SatisfactionScore = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const Star = styled.span<{ active: boolean }>`
  color: ${props => (props.active ? '#FFD700' : '#ddd')};
  cursor: pointer;
  font-size: 24px;
`;

const UserPreferences: React.FC = () => {
  const { t } = useTranslation('schedule');
  const dispatch = useDispatch();
  const { preferences, loading, error } = useSelector((state: any) => state.userPreferences);
  const [currentUser, setCurrentUser] = useState<UserNotificationPreferences | null>(null);
  const [satisfactionScore, setSatisfactionScore] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    dispatch(fetchUserPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (preferences.length > 0) {
      setCurrentUser(preferences[0]);
    }
  }, [preferences]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!currentUser) return;
    const { name, value, type } = e.target;
    setCurrentUser(prev => {
      if (!prev) return null;
      if (type === 'checkbox') {
        return {
          ...prev,
          [name]: (e.target as HTMLInputElement).checked,
        };
      }
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof UserNotificationPreferences],
            [child]: type === 'number' ? Number(value) : value,
          },
        };
      }
      return {
        ...prev,
        [name]: type === 'number' ? Number(value) : value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      dispatch(updateUserPreferences(currentUser));
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      dispatch(
        submitFeedback({
          userId: currentUser.userId,
          satisfactionScore,
          feedbackText,
        })
      );
      setSatisfactionScore(0);
      setFeedbackText('');
    }
  };

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <Container>
      <Title>{t('notifications.preferences.title')}</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>{t('notifications.preferences.preferredChannels')}</Label>
          {Object.values(NotificationChannel).map(channel => (
            <div key={channel}>
              <Checkbox
                type="checkbox"
                name="preferredChannels"
                value={channel}
                checked={currentUser.preferredChannels.includes(channel)}
                onChange={e => {
                  const newChannels = e.target.checked
                    ? [...currentUser.preferredChannels, channel]
                    : currentUser.preferredChannels.filter(c => c !== channel);
                  setCurrentUser(prev =>
                    prev ? { ...prev, preferredChannels: newChannels } : null
                  );
                }}
              />
              {t(`notifications.channels.${channel}`)}
            </div>
          ))}
        </FormGroup>
        <FormGroup>
          <Label>{t('notifications.preferences.notificationTimes')}</Label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Input
              type="number"
              name="notificationTimes.start"
              value={currentUser.notificationTimes.start}
              onChange={handleInputChange}
              min="0"
              max="23"
            />
            <Input
              type="number"
              name="notificationTimes.end"
              value={currentUser.notificationTimes.end}
              onChange={handleInputChange}
              min="0"
              max="23"
            />
          </div>
        </FormGroup>
        <FormGroup>
          <Label>{t('notifications.preferences.maxDailyNotifications')}</Label>
          <Input
            type="number"
            name="maxDailyNotifications"
            value={currentUser.maxDailyNotifications}
            onChange={handleInputChange}
            min="1"
          />
        </FormGroup>
        <FormGroup>
          <Label>
            <Checkbox
              type="checkbox"
              name="doNotDisturb.enabled"
              checked={currentUser.doNotDisturb.enabled}
              onChange={handleInputChange}
            />
            {t('notifications.preferences.doNotDisturb')}
          </Label>
          {currentUser.doNotDisturb.enabled && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Input
                type="number"
                name="doNotDisturb.start"
                value={currentUser.doNotDisturb.start}
                onChange={handleInputChange}
                min="0"
                max="23"
              />
              <Input
                type="number"
                name="doNotDisturb.end"
                value={currentUser.doNotDisturb.end}
                onChange={handleInputChange}
                min="0"
                max="23"
              />
            </div>
          )}
        </FormGroup>
        <Button type="submit">{t('common.save')}</Button>
      </Form>
      <FeedbackForm>
        <h3>{t('notifications.preferences.feedback')}</h3>
        <form onSubmit={handleFeedbackSubmit}>
          <FormGroup>
            <Label>{t('notifications.preferences.satisfactionScore')}</Label>
            <SatisfactionScore>
              {[1, 2, 3, 4, 5].map(score => (
                <Star
                  key={score}
                  active={score <= satisfactionScore}
                  onClick={() => setSatisfactionScore(score)}
                >
                  ★
                </Star>
              ))}
            </SatisfactionScore>
          </FormGroup>
          <FormGroup>
            <Label>{t('notifications.preferences.feedbackText')}</Label>
            <Input
              type="text"
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              placeholder={t('notifications.preferences.feedbackPlaceholder')}
            />
          </FormGroup>
          <Button type="submit">{t('notifications.preferences.submitFeedback')}</Button>
        </form>
      </FeedbackForm>
    </Container>
  );
};

export default UserPreferences;
