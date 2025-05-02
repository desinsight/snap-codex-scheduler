import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { fetchGroups, createGroup, updateGroup, deleteGroup, toggleGroupActive, } from '../../store/slices/notificationGroupSlice';
const Container = styled.div `
  padding: 20px;
`;
const Title = styled.h2 `
  margin-bottom: 20px;
`;
const GroupList = styled.div `
  margin-bottom: 20px;
`;
const GroupItem = styled.div `
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
const GroupHeader = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const GroupName = styled.h3 `
  margin: 0;
`;
const GroupStatus = styled.span `
  color: ${({ isActive }) => (isActive ? '#4CAF50' : '#F44336')};
  font-size: 0.9em;
`;
const GroupContent = styled.div `
  margin-bottom: 10px;
`;
const GroupSettings = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 10px;
`;
const SettingItem = styled.div `
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const SettingLabel = styled.span `
  font-weight: bold;
`;
const SettingValue = styled.span `
  color: #666;
`;
const GroupActions = styled.div `
  display: flex;
  gap: 10px;
`;
const Button = styled.button `
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
const DeleteButton = styled(Button) `
  background-color: #f44336;

  &:hover {
    background-color: #d32f2f;
  }
`;
const ToggleButton = styled(Button) `
  background-color: ${({ isActive }) => (isActive ? '#4CAF50' : '#F44336')};

  &:hover {
    background-color: ${({ isActive }) => (isActive ? '#388E3C' : '#D32F2F')};
  }
`;
const Form = styled.form `
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;
const Input = styled.input `
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
const Select = styled.select `
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
const TextArea = styled.textarea `
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
`;
const ErrorMessage = styled.div `
  color: #f44336;
  margin-bottom: 10px;
`;
const LoadingMessage = styled.div `
  color: #666;
  margin-bottom: 10px;
`;
const NotificationGroupManager = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation('schedule');
    const { groups, loading, error } = useSelector((state) => state.notificationGroups);
    const [newGroup, setNewGroup] = useState({
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
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (newGroup.name && newGroup.settings) {
            await dispatch(createGroup(newGroup));
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
    const handleUpdateGroup = async (group) => {
        await dispatch(updateGroup(group));
    };
    const handleDeleteGroup = async (groupId) => {
        if (window.confirm(t('notifications.groups.confirmDelete'))) {
            await dispatch(deleteGroup(groupId));
        }
    };
    const handleToggleGroupActive = async (groupId, isActive) => {
        await dispatch(toggleGroupActive({ groupId, isActive }));
    };
    if (loading) {
        return _jsx(LoadingMessage, { children: t('notifications.groups.loading') });
    }
    return (_jsxs(Container, { children: [_jsx(Title, { children: t('notifications.groups.title') }), error && _jsx(ErrorMessage, { children: error }), _jsxs(Form, { onSubmit: handleCreateGroup, children: [_jsx(Input, { type: "text", placeholder: t('notifications.groups.name'), value: newGroup.name, onChange: e => setNewGroup(prev => ({ ...prev, name: e.target.value })) }), _jsx(TextArea, { placeholder: t('notifications.groups.description'), value: newGroup.description, onChange: e => setNewGroup(prev => ({ ...prev, description: e.target.value })) }), _jsxs(GroupSettings, { children: [_jsxs(SettingItem, { children: [_jsx(SettingLabel, { children: t('notifications.groups.type') }), _jsxs(Select, { value: newGroup.settings?.type, onChange: e => setNewGroup(prev => ({
                                            ...prev,
                                            settings: { ...prev.settings, type: e.target.value },
                                        })), children: [_jsx("option", { value: "email", children: t('notifications.types.email') }), _jsx("option", { value: "browser", children: t('notifications.types.browser') })] })] }), _jsxs(SettingItem, { children: [_jsx(SettingLabel, { children: t('notifications.groups.time') }), _jsxs(Select, { value: newGroup.settings?.time, onChange: e => setNewGroup(prev => ({
                                            ...prev,
                                            settings: { ...prev.settings, time: e.target.value },
                                        })), children: [_jsx("option", { value: "5", children: t('notifications.times.5') }), _jsx("option", { value: "10", children: t('notifications.times.10') }), _jsx("option", { value: "15", children: t('notifications.times.15') }), _jsx("option", { value: "30", children: t('notifications.times.30') }), _jsx("option", { value: "60", children: t('notifications.times.60') }), _jsx("option", { value: "120", children: t('notifications.times.120') }), _jsx("option", { value: "1440", children: t('notifications.times.1440') })] })] }), _jsxs(SettingItem, { children: [_jsx(SettingLabel, { children: t('notifications.groups.priority') }), _jsxs(Select, { value: newGroup.settings?.priority, onChange: e => setNewGroup(prev => ({
                                            ...prev,
                                            settings: { ...prev.settings, priority: e.target.value },
                                        })), children: [_jsx("option", { value: "low", children: t('notifications.priority.low') }), _jsx("option", { value: "medium", children: t('notifications.priority.medium') }), _jsx("option", { value: "high", children: t('notifications.priority.high') }), _jsx("option", { value: "urgent", children: t('notifications.priority.urgent') })] })] })] }), _jsx(Button, { type: "submit", disabled: !newGroup.name, children: t('notifications.groups.create') })] }), _jsx(GroupList, { children: groups.map(group => (_jsxs(GroupItem, { priority: group.settings.priority, children: [_jsxs(GroupHeader, { children: [_jsx(GroupName, { children: group.name }), _jsx(GroupStatus, { isActive: group.isActive, children: group.isActive
                                        ? t('notifications.groups.active')
                                        : t('notifications.groups.inactive') })] }), group.description && (_jsxs(GroupContent, { children: [_jsxs("strong", { children: [t('notifications.groups.description'), ":"] }), " ", group.description] })), _jsxs(GroupSettings, { children: [_jsxs(SettingItem, { children: [_jsx(SettingLabel, { children: t('notifications.groups.type') }), _jsx(SettingValue, { children: t(`notifications.types.${group.settings.type}`) })] }), _jsxs(SettingItem, { children: [_jsx(SettingLabel, { children: t('notifications.groups.time') }), _jsx(SettingValue, { children: t(`notifications.times.${group.settings.time}`) })] }), _jsxs(SettingItem, { children: [_jsx(SettingLabel, { children: t('notifications.groups.priority') }), _jsx(SettingValue, { children: t(`notifications.priority.${group.settings.priority}`) })] })] }), _jsxs(GroupActions, { children: [_jsx(Button, { onClick: () => handleUpdateGroup(group), children: t('notifications.groups.edit') }), _jsx(ToggleButton, { isActive: group.isActive, onClick: () => handleToggleGroupActive(group.id, !group.isActive), children: group.isActive
                                        ? t('notifications.groups.deactivate')
                                        : t('notifications.groups.activate') }), _jsx(DeleteButton, { onClick: () => handleDeleteGroup(group.id), children: t('notifications.groups.delete') })] })] }, group.id))) })] }));
};
export default NotificationGroupManager;
