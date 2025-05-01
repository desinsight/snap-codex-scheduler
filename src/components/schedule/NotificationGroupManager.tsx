import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { RootState } from '../../store';
import {
  fetchGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  toggleGroupActive,
} from '../../store/slices/notificationGroupSlice';
import {
  NotificationGroup,
  NotificationType,
  NotificationTime,
  NotificationPriority,
} from '../../types/notification';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const GroupList = styled.div`
  margin-bottom: 20px;
`;

const GroupItem = styled.div<{ priority: NotificationPriority }>`
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: ${({ priority }) => {
    switch (priority) {
      case 'urgent':
        return '#ffebee';
      case 'high':
        return '#fff3e0';
      case 'medium':
        return '#e8f5e9';
      case 'low':
        return '#e3f2fd';
      default:
        return '#fff';
    }
  }};
`;

const GroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const GroupName = styled.h3`
  margin: 0;
`;

const GroupStatus = styled.span<{ isActive: boolean }>`
  color: ${({ isActive }) => (isActive ? '#4CAF50' : '#F44336')};
  font-size: 0.9em;
`;

const GroupContent = styled.div`
  margin-bottom: 10px;
`;

const GroupSettings = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 10px;
`;

const SettingItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SettingLabel = styled.span`
  font-weight: bold;
`;

const SettingValue = styled.span`
  color: #666;
`;

const GroupActions = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #2196f3;
  color: white;

  &:hover {
    background-color: #1976d2;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #f44336;

  &:hover {
    background-color: #d32f2f;
  }
`;

const ToggleButton = styled(Button)<{ isActive: boolean }>`
  background-color: ${({ isActive }) => (isActive ? '#4CAF50' : '#F44336')};

  &:hover {
    background-color: ${({ isActive }) => (isActive ? '#388E3C' : '#D32F2F')};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
`;

const ErrorMessage = styled.div`
  color: #f44336;
  margin-bottom: 10px;
`;

const LoadingMessage = styled.div`
  color: #666;
  margin-bottom: 10px;
`;

const NotificationGroupManager: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('schedule');
  const { groups, loading, error } = useSelector((state: RootState) => state.notificationGroups);

  const [newGroup, setNewGroup] = useState<Partial<NotificationGroup>>({
    name: '',
    description: '',
    scheduleIds: [],
    settings: {
      type: 'email',
      time: '30',
      priority: 'medium',
    },
    isActive: true,
  });

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroup.name && newGroup.settings) {
      await dispatch(
        createGroup(newGroup as Omit<NotificationGroup, 'id' | 'createdAt' | 'updatedAt'>)
      );
      setNewGroup({
        name: '',
        description: '',
        scheduleIds: [],
        settings: {
          type: 'email',
          time: '30',
          priority: 'medium',
        },
        isActive: true,
      });
    }
  };

  const handleUpdateGroup = async (group: NotificationGroup) => {
    await dispatch(updateGroup(group));
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm(t('notifications.groups.confirmDelete'))) {
      await dispatch(deleteGroup(groupId));
    }
  };

  const handleToggleGroupActive = async (groupId: string, isActive: boolean) => {
    await dispatch(toggleGroupActive({ groupId, isActive }));
  };

  if (loading) {
    return <LoadingMessage>{t('notifications.groups.loading')}</LoadingMessage>;
  }

  return (
    <Container>
      <Title>{t('notifications.groups.title')}</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Form onSubmit={handleCreateGroup}>
        <Input
          type="text"
          placeholder={t('notifications.groups.name')}
          value={newGroup.name}
          onChange={e => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
        />

        <TextArea
          placeholder={t('notifications.groups.description')}
          value={newGroup.description}
          onChange={e => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
        />

        <GroupSettings>
          <SettingItem>
            <SettingLabel>{t('notifications.groups.type')}</SettingLabel>
            <Select
              value={newGroup.settings?.type}
              onChange={e =>
                setNewGroup(prev => ({
                  ...prev,
                  settings: { ...prev.settings!, type: e.target.value as NotificationType },
                }))
              }
            >
              <option value="email">{t('notifications.types.email')}</option>
              <option value="browser">{t('notifications.types.browser')}</option>
            </Select>
          </SettingItem>

          <SettingItem>
            <SettingLabel>{t('notifications.groups.time')}</SettingLabel>
            <Select
              value={newGroup.settings?.time}
              onChange={e =>
                setNewGroup(prev => ({
                  ...prev,
                  settings: { ...prev.settings!, time: e.target.value as NotificationTime },
                }))
              }
            >
              <option value="5">{t('notifications.times.5')}</option>
              <option value="10">{t('notifications.times.10')}</option>
              <option value="15">{t('notifications.times.15')}</option>
              <option value="30">{t('notifications.times.30')}</option>
              <option value="60">{t('notifications.times.60')}</option>
              <option value="120">{t('notifications.times.120')}</option>
              <option value="1440">{t('notifications.times.1440')}</option>
            </Select>
          </SettingItem>

          <SettingItem>
            <SettingLabel>{t('notifications.groups.priority')}</SettingLabel>
            <Select
              value={newGroup.settings?.priority}
              onChange={e =>
                setNewGroup(prev => ({
                  ...prev,
                  settings: { ...prev.settings!, priority: e.target.value as NotificationPriority },
                }))
              }
            >
              <option value="low">{t('notifications.priority.low')}</option>
              <option value="medium">{t('notifications.priority.medium')}</option>
              <option value="high">{t('notifications.priority.high')}</option>
              <option value="urgent">{t('notifications.priority.urgent')}</option>
            </Select>
          </SettingItem>
        </GroupSettings>

        <Button type="submit" disabled={!newGroup.name}>
          {t('notifications.groups.create')}
        </Button>
      </Form>

      <GroupList>
        {groups.map(group => (
          <GroupItem key={group.id} priority={group.settings.priority}>
            <GroupHeader>
              <GroupName>{group.name}</GroupName>
              <GroupStatus isActive={group.isActive}>
                {group.isActive
                  ? t('notifications.groups.active')
                  : t('notifications.groups.inactive')}
              </GroupStatus>
            </GroupHeader>

            {group.description && (
              <GroupContent>
                <strong>{t('notifications.groups.description')}:</strong> {group.description}
              </GroupContent>
            )}

            <GroupSettings>
              <SettingItem>
                <SettingLabel>{t('notifications.groups.type')}</SettingLabel>
                <SettingValue>{t(`notifications.types.${group.settings.type}`)}</SettingValue>
              </SettingItem>

              <SettingItem>
                <SettingLabel>{t('notifications.groups.time')}</SettingLabel>
                <SettingValue>{t(`notifications.times.${group.settings.time}`)}</SettingValue>
              </SettingItem>

              <SettingItem>
                <SettingLabel>{t('notifications.groups.priority')}</SettingLabel>
                <SettingValue>
                  {t(`notifications.priority.${group.settings.priority}`)}
                </SettingValue>
              </SettingItem>
            </GroupSettings>

            <GroupActions>
              <Button onClick={() => handleUpdateGroup(group)}>
                {t('notifications.groups.edit')}
              </Button>
              <ToggleButton
                isActive={group.isActive}
                onClick={() => handleToggleGroupActive(group.id, !group.isActive)}
              >
                {group.isActive
                  ? t('notifications.groups.deactivate')
                  : t('notifications.groups.activate')}
              </ToggleButton>
              <DeleteButton onClick={() => handleDeleteGroup(group.id)}>
                {t('notifications.groups.delete')}
              </DeleteButton>
            </GroupActions>
          </GroupItem>
        ))}
      </GroupList>
    </Container>
  );
};

export default NotificationGroupManager;
