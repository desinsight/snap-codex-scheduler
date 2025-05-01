import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NotificationHistory, NotificationPreference, NotificationTiming } from '../../types/notification';
import NotificationService from '../../services/NotificationService';

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 360px;
  height: 100vh;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 1000;
  transform: translateX(${({ isOpen }) => (isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.space.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.space.sm};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ active, theme }) =>
    active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.text.secondary};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Content = styled.div`
  height: calc(100vh - 120px);
  overflow-y: auto;
`;

const NotificationItem = styled.div<{ unread: boolean }>`
  padding: ${({ theme }) => theme.space.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ unread, theme }) =>
    unread ? `${theme.colors.primary}05` : 'transparent'};
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const PreferencesForm = styled.form`
  padding: ${({ theme }) => theme.space.md};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.space.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
`;

const TimingContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences'>('notifications');
  const [notifications, setNotifications] = useState<NotificationHistory[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference>({
    enabled: true,
    type: 'BOTH',
    timing: [{ value: 15, unit: 'minutes' }],
  });

  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = () => {
    const history = notificationService.getNotificationHistory();
    setNotifications(history);
  };

  const handleNotificationClick = (notification: NotificationHistory) => {
    if (!notification.read) {
      notificationService.markNotificationAsRead(notification.id);
      loadNotifications();
    }
  };

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 알림 설정 저장 로직
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  };

  const addTiming = () => {
    setPreferences(prev => ({
      ...prev,
      timing: [...prev.timing, { value: 15, unit: 'minutes' }],
    }));
  };

  const removeTiming = (index: number) => {
    setPreferences(prev => ({
      ...prev,
      timing: prev.timing.filter((_, i) => i !== index),
    }));
  };

  return (
    <Container isOpen={isOpen}>
      <Header>
        <Title>알림 센터</Title>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </Header>

      <TabContainer>
        <Tab
          active={activeTab === 'notifications'}
          onClick={() => setActiveTab('notifications')}
        >
          알림
        </Tab>
        <Tab
          active={activeTab === 'preferences'}
          onClick={() => setActiveTab('preferences')}
        >
          설정
        </Tab>
      </TabContainer>

      <Content>
        {activeTab === 'notifications' ? (
          notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              unread={!notification.read}
              onClick={() => handleNotificationClick(notification)}
            >
              <h4>{notification.eventTitle}</h4>
              <p>{notification.message}</p>
              <small>
                {new Date(notification.timestamp).toLocaleString()}
              </small>
            </NotificationItem>
          ))
        ) : (
          <PreferencesForm onSubmit={handlePreferencesSubmit}>
            <FormGroup>
              <Label>알림 활성화</Label>
              <input
                type="checkbox"
                checked={preferences.enabled}
                onChange={e =>
                  setPreferences(prev => ({
                    ...prev,
                    enabled: e.target.checked,
                  }))
                }
              />
            </FormGroup>

            <FormGroup>
              <Label>알림 유형</Label>
              <Select
                value={preferences.type}
                onChange={e =>
                  setPreferences(prev => ({
                    ...prev,
                    type: e.target.value as NotificationType,
                  }))
                }
              >
                <option value="BROWSER">브라우저 알림</option>
                <option value="EMAIL">이메일 알림</option>
                <option value="BOTH">모두</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>알림 시간</Label>
              {preferences.timing.map((timing, index) => (
                <TimingContainer key={index}>
                  <input
                    type="number"
                    value={timing.value}
                    onChange={e =>
                      setPreferences(prev => ({
                        ...prev,
                        timing: prev.timing.map((t, i) =>
                          i === index
                            ? { ...t, value: parseInt(e.target.value) }
                            : t
                        ),
                      }))
                    }
                    min="1"
                  />
                  <Select
                    value={timing.unit}
                    onChange={e =>
                      setPreferences(prev => ({
                        ...prev,
                        timing: prev.timing.map((t, i) =>
                          i === index
                            ? { ...t, unit: e.target.value as 'minutes' | 'hours' | 'days' }
                            : t
                        ),
                      }))
                    }
                  >
                    <option value="minutes">분</option>
                    <option value="hours">시간</option>
                    <option value="days">일</option>
                  </Select>
                  <button
                    type="button"
                    onClick={() => removeTiming(index)}
                  >
                    삭제
                  </button>
                </TimingContainer>
              ))}
              <button type="button" onClick={addTiming}>
                알림 시간 추가
              </button>
            </FormGroup>

            <button type="submit">설정 저장</button>
          </PreferencesForm>
        )}
      </Content>
    </Container>
  );
};

export default NotificationCenter; 