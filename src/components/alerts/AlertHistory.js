import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
const Container = styled.div `
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;
const Header = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.h2 `
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;
const FilterGroup = styled.div `
  display: flex;
  gap: 10px;
`;
const Select = styled.select `
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;
const AlertList = styled.div `
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const AlertItem = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.background};
  border-left: 4px solid ${({ theme, priority }) => {
    switch (priority) {
        case 'critical':
            return theme.colors.error;
        case 'high':
            return theme.colors.warning;
        case 'medium':
            return theme.colors.info;
        default:
            return theme.colors.success;
    }
}};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;
const AlertContent = styled.div `
  flex: 1;
`;
const AlertMessage = styled.div `
  font-weight: 500;
  margin-bottom: 5px;
`;
const AlertMetadata = styled.div `
  font-size: 0.9em;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
const ActionButton = styled.button `
  padding: 6px 12px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;
const Pagination = styled.div `
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;
const AlertHistory = ({ notifications, onAcknowledge, onResolve }) => {
    const { t } = useTranslation();
    const [filteredNotifications, setFilteredNotifications] = useState(notifications);
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    useEffect(() => {
        let filtered = [...notifications];
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(n => n.priority === priorityFilter);
        }
        if (statusFilter !== 'all') {
            filtered = filtered.filter(n => n.status === statusFilter);
        }
        setFilteredNotifications(filtered);
        setCurrentPage(1);
    }, [notifications, priorityFilter, statusFilter]);
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };
    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
    const paginatedNotifications = filteredNotifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return (_jsxs(Container, { children: [_jsxs(Header, { children: [_jsx(Title, { children: t('alerts.history.title') }), _jsxs(FilterGroup, { children: [_jsxs(Select, { value: priorityFilter, onChange: e => setPriorityFilter(e.target.value), children: [_jsx("option", { value: "all", children: t('alerts.filter.allPriorities') }), _jsx("option", { value: "low", children: t('alerts.priority.low') }), _jsx("option", { value: "medium", children: t('alerts.priority.medium') }), _jsx("option", { value: "high", children: t('alerts.priority.high') }), _jsx("option", { value: "critical", children: t('alerts.priority.critical') })] }), _jsxs(Select, { value: statusFilter, onChange: e => setStatusFilter(e.target.value), children: [_jsx("option", { value: "all", children: t('alerts.filter.allStatuses') }), _jsx("option", { value: "active", children: t('alerts.status.active') }), _jsx("option", { value: "resolved", children: t('alerts.status.resolved') }), _jsx("option", { value: "acknowledged", children: t('alerts.status.acknowledged') })] })] })] }), _jsx(AlertList, { children: paginatedNotifications.map(notification => (_jsxs(AlertItem, { priority: notification.priority, children: [_jsxs(AlertContent, { children: [_jsx(AlertMessage, { children: notification.message }), _jsxs(AlertMetadata, { children: [t('alerts.metadata.metric'), ": ", notification.metadata.metric, " |", t('alerts.metadata.value'), ": ", notification.metadata.value, " |", t('alerts.metadata.threshold'), ": ", notification.metadata.threshold, " |", t('alerts.metadata.time'), ": ", formatTime(notification.timestamp)] })] }), notification.status === 'active' && (_jsxs("div", { children: [_jsx(ActionButton, { onClick: () => onAcknowledge(notification.id), children: t('alerts.action.acknowledge') }), _jsx(ActionButton, { onClick: () => onResolve(notification.id), children: t('alerts.action.resolve') })] }))] }, notification.id))) }), totalPages > 1 && (_jsxs(Pagination, { children: [_jsx(ActionButton, { onClick: () => setCurrentPage(prev => Math.max(1, prev - 1)), disabled: currentPage === 1, children: t('common.previous') }), _jsxs("span", { children: [t('common.page'), " ", currentPage, " / ", totalPages] }), _jsx(ActionButton, { onClick: () => setCurrentPage(prev => Math.min(totalPages, prev + 1)), disabled: currentPage === totalPages, children: t('common.next') })] }))] }));
};
export default AlertHistory;
