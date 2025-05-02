import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import NotificationService from '../../services/NotificationService';
const Container = styled.div `
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
const Header = styled.div `
  padding: ${({ theme }) => theme.space.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.h2 `
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;
const CloseButton = styled.button `
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;
const TabContainer = styled.div `
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;
const Tab = styled.button `
  flex: 1;
  padding: ${({ theme }) => theme.space.sm};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ active, theme }) => (active ? theme.colors.primary : 'transparent')};
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.text.secondary)};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
const Content = styled.div `
  height: calc(100vh - 120px);
  overflow-y: auto;
`;
const NotificationItem = styled.div `
  padding: ${({ theme }) => theme.space.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ unread, theme }) => (unread ? `${theme.colors.primary}05` : 'transparent')};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;
const PreferencesForm = styled.form `
  padding: ${({ theme }) => theme.space.md};
`;
const FormGroup = styled.div `
  margin-bottom: ${({ theme }) => theme.space.md};
`;
const Label = styled.label `
  display: block;
  margin-bottom: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;
const Select = styled.select `
  width: 100%;
  padding: ${({ theme }) => theme.space.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
`;
const TimingContainer = styled.div `
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;
const NotificationCenter = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('notifications');
    const [notifications, setNotifications] = useState([]);
    const [preferences, setPreferences] = useState({
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
    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            notificationService.markNotificationAsRead(notification.id);
            loadNotifications();
        }
    };
    const handlePreferencesSubmit = (e) => {
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
    const removeTiming = (index) => {
        setPreferences(prev => ({
            ...prev,
            timing: prev.timing.filter((_, i) => i !== index),
        }));
    };
    return (_jsxs(Container, { isOpen: isOpen, children: [_jsxs(Header, { children: [_jsx(Title, { children: "\uC54C\uB9BC \uC13C\uD130" }), _jsx(CloseButton, { onClick: onClose, children: "\u2715" })] }), _jsxs(TabContainer, { children: [_jsx(Tab, { active: activeTab === 'notifications', onClick: () => setActiveTab('notifications'), children: "\uC54C\uB9BC" }), _jsx(Tab, { active: activeTab === 'preferences', onClick: () => setActiveTab('preferences'), children: "\uC124\uC815" })] }), _jsx(Content, { children: activeTab === 'notifications' ? (notifications.map(notification => (_jsxs(NotificationItem, { unread: !notification.read, onClick: () => handleNotificationClick(notification), children: [_jsx("h4", { children: notification.eventTitle }), _jsx("p", { children: notification.message }), _jsx("small", { children: new Date(notification.timestamp).toLocaleString() })] }, notification.id)))) : (_jsxs(PreferencesForm, { onSubmit: handlePreferencesSubmit, children: [_jsxs(FormGroup, { children: [_jsx(Label, { children: "\uC54C\uB9BC \uD65C\uC131\uD654" }), _jsx("input", { type: "checkbox", checked: preferences.enabled, onChange: e => setPreferences(prev => ({
                                        ...prev,
                                        enabled: e.target.checked,
                                    })) })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: "\uC54C\uB9BC \uC720\uD615" }), _jsxs(Select, { value: preferences.type, onChange: e => setPreferences(prev => ({
                                        ...prev,
                                        type: e.target.value,
                                    })), children: [_jsx("option", { value: "BROWSER", children: "\uBE0C\uB77C\uC6B0\uC800 \uC54C\uB9BC" }), _jsx("option", { value: "EMAIL", children: "\uC774\uBA54\uC77C \uC54C\uB9BC" }), _jsx("option", { value: "BOTH", children: "\uBAA8\uB450" })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: "\uC54C\uB9BC \uC2DC\uAC04" }), preferences.timing.map((timing, index) => (_jsxs(TimingContainer, { children: [_jsx("input", { type: "number", value: timing.value, onChange: e => setPreferences(prev => ({
                                                ...prev,
                                                timing: prev.timing.map((t, i) => i === index ? { ...t, value: parseInt(e.target.value) } : t),
                                            })), min: "1" }), _jsxs(Select, { value: timing.unit, onChange: e => setPreferences(prev => ({
                                                ...prev,
                                                timing: prev.timing.map((t, i) => i === index
                                                    ? { ...t, unit: e.target.value }
                                                    : t),
                                            })), children: [_jsx("option", { value: "minutes", children: "\uBD84" }), _jsx("option", { value: "hours", children: "\uC2DC\uAC04" }), _jsx("option", { value: "days", children: "\uC77C" })] }), _jsx("button", { type: "button", onClick: () => removeTiming(index), children: "\uC0AD\uC81C" })] }, index))), _jsx("button", { type: "button", onClick: addTiming, children: "\uC54C\uB9BC \uC2DC\uAC04 \uCD94\uAC00" })] }), _jsx("button", { type: "submit", children: "\uC124\uC815 \uC800\uC7A5" })] })) })] }));
};
export default NotificationCenter;
