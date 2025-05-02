import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheck, FiTrash2, FiFilter, FiSearch } from 'react-icons/fi';
import Button from '../Button/Button';
import Card from '../Card/Card';
const NotificationContainer = styled.div `
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;
const NotificationHeader = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;
const NotificationTitle = styled.h1 `
  font-size: ${({ theme }) => theme.typography.h4.fontSize};
  font-weight: ${({ theme }) => theme.typography.h4.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;
const NotificationActions = styled.div `
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;
const SearchBar = styled.div `
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  width: 300px;

  input {
    border: none;
    background: none;
    flex: 1;
    padding: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.typography.body2.fontSize};
    color: ${({ theme }) => theme.colors.text.primary};

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }

  svg {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;
const NotificationList = styled.div `
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;
const NotificationItem = styled(motion.div) `
  background-color: ${({ theme, read }) => read ? theme.colors.background.paper : theme.colors.primary.main}10;
  border-radius: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration.short}ms
    ${({ theme }) => theme.transitions.easing.easeInOut};

  &:hover {
    transform: translateX(4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;
const NotificationItemHeader = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;
const NotificationTitleText = styled.h3 `
  font-size: ${({ theme }) => theme.typography.h6.fontSize};
  font-weight: ${({ theme, read }) => (read ? 400 : 600)};
  color: ${({ theme }) => theme.colors.text.primary};
`;
const NotificationTimestamp = styled.span `
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
`;
const NotificationMessage = styled.p `
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;
const NotificationActionsContainer = styled.div `
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;
const NotificationTypeBadge = styled.span `
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: 500;
  margin-right: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme, type }) => theme.colors[type].main}20;
  color: ${({ theme, type }) => theme.colors[type].main};
`;
const NotificationModal = styled(motion.div) `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  z-index: 1000;
  width: 90%;
  max-width: 600px;
`;
const ModalOverlay = styled(motion.div) `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;
const Notification = () => {
    const [notifications, setNotifications] = useState([
        {
            id: '1',
            title: 'New Message',
            message: 'You have received a new message from John Doe',
            timestamp: new Date(),
            read: false,
            type: 'info',
            action: {
                label: 'View Message',
                onClick: () => console.log('View message'),
            },
        },
        {
            id: '2',
            title: 'Meeting Reminder',
            message: 'Team meeting starts in 30 minutes',
            timestamp: new Date(Date.now() - 3600000),
            read: true,
            type: 'warning',
        },
        {
            id: '3',
            title: 'Task Completed',
            message: 'Your task "Update documentation" has been completed',
            timestamp: new Date(Date.now() - 86400000),
            read: true,
            type: 'success',
        },
    ]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);
        setIsModalOpen(true);
        if (!notification.read) {
            setNotifications(prev => prev.map(n => (n.id === notification.id ? { ...n, read: true } : n)));
        }
    };
    const handleMarkAsRead = (id) => {
        setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    };
    const handleDelete = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        if (selectedNotification?.id === id) {
            setIsModalOpen(false);
        }
    };
    const formatTimestamp = (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (minutes < 60) {
            return `${minutes}m ago`;
        }
        else if (hours < 24) {
            return `${hours}h ago`;
        }
        else {
            return `${days}d ago`;
        }
    };
    return (_jsxs(NotificationContainer, { children: [_jsxs(NotificationHeader, { children: [_jsxs(NotificationTitle, { children: [_jsx(FiBell, { size: 24 }), "Notifications"] }), _jsxs(NotificationActions, { children: [_jsxs(SearchBar, { children: [_jsx(FiSearch, {}), _jsx("input", { type: "text", placeholder: "Search notifications..." })] }), _jsx(Button, { variant: "outlined", color: "primary", startIcon: _jsx(FiFilter, {}), children: "Filter" })] })] }), _jsx(NotificationList, { children: notifications.map(notification => (_jsxs(NotificationItem, { read: notification.read, onClick: () => handleNotificationClick(notification), initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.2 }, children: [_jsxs(NotificationItemHeader, { children: [_jsxs(NotificationTitleText, { read: notification.read, children: [_jsx(NotificationTypeBadge, { type: notification.type, children: notification.type }), notification.title] }), _jsx(NotificationTimestamp, { children: formatTimestamp(notification.timestamp) })] }), _jsx(NotificationMessage, { children: notification.message }), _jsxs(NotificationActionsContainer, { children: [!notification.read && (_jsx(Button, { variant: "text", color: "primary", size: "small", startIcon: _jsx(FiCheck, {}), onClick: e => {
                                        e.stopPropagation();
                                        handleMarkAsRead(notification.id);
                                    }, children: "Mark as Read" })), _jsx(Button, { variant: "text", color: "error", size: "small", startIcon: _jsx(FiTrash2, {}), onClick: e => {
                                        e.stopPropagation();
                                        handleDelete(notification.id);
                                    }, children: "Delete" })] })] }, notification.id))) }), _jsx(AnimatePresence, { children: isModalOpen && selectedNotification && (_jsxs(_Fragment, { children: [_jsx(ModalOverlay, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setIsModalOpen(false) }), _jsx(NotificationModal, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 }, children: _jsxs(Card, { children: [_jsxs(Card.Header, { children: [_jsxs(NotificationTitleText, { read: selectedNotification.read, children: [_jsx(NotificationTypeBadge, { type: selectedNotification.type, children: selectedNotification.type }), selectedNotification.title] }), _jsx(NotificationTimestamp, { children: formatTimestamp(selectedNotification.timestamp) })] }), _jsx(Card.Content, { children: _jsx(NotificationMessage, { children: selectedNotification.message }) }), _jsx(Card.Footer, { children: selectedNotification.action && (_jsx(Button, { color: "primary", onClick: () => {
                                                selectedNotification.action?.onClick();
                                                setIsModalOpen(false);
                                            }, children: selectedNotification.action.label })) })] }) })] })) })] }));
};
export default Notification;
