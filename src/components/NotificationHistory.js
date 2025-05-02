import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { NotificationLogger } from '../services/NotificationLogger';
export const NotificationHistory = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const limit = 10;
    useEffect(() => {
        loadNotifications();
        loadUnreadCount();
    }, [page, selectedFilter]);
    const loadNotifications = async () => {
        try {
            const logger = NotificationLogger.getInstance();
            const offset = (page - 1) * limit;
            const history = await logger.getNotificationHistory('current-user-id', limit, offset);
            if (selectedFilter === 'unread') {
                setNotifications(history.filter(n => !n.read));
            }
            else {
                setNotifications(history);
            }
            setLoading(false);
        }
        catch (err) {
            setError('알림 내역을 불러오는데 실패했습니다.');
            setLoading(false);
        }
    };
    const loadUnreadCount = async () => {
        try {
            const logger = NotificationLogger.getInstance();
            const count = await logger.getUnreadCount('current-user-id');
            setUnreadCount(count);
        }
        catch (err) {
            console.error('Failed to load unread count:', err);
        }
    };
    const handleMarkAsRead = async (notificationId) => {
        try {
            const logger = NotificationLogger.getInstance();
            await logger.markAsRead(notificationId);
            await loadNotifications();
            await loadUnreadCount();
        }
        catch (err) {
            setError('알림을 읽음으로 표시하는데 실패했습니다.');
        }
    };
    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        setPage(1);
    };
    if (loading) {
        return _jsx("div", { children: "Loading..." });
    }
    if (error) {
        return _jsx("div", { className: "error", children: error });
    }
    return (_jsxs("div", { className: "notification-history", children: [_jsxs("div", { className: "header", children: [_jsx("h2", { children: "\uC54C\uB9BC \uB0B4\uC5ED" }), _jsxs("div", { className: "filters", children: [_jsxs("button", { className: selectedFilter === 'all' ? 'active' : '', onClick: () => handleFilterChange('all'), children: ["\uC804\uCCB4 (", notifications.length, ")"] }), _jsxs("button", { className: selectedFilter === 'unread' ? 'active' : '', onClick: () => handleFilterChange('unread'), children: ["\uC77D\uC9C0 \uC54A\uC74C (", unreadCount, ")"] })] })] }), _jsx("div", { className: "notifications-list", children: notifications.map(notification => (_jsxs("div", { className: `notification-item ${notification.read ? 'read' : 'unread'}`, children: [_jsxs("div", { className: "notification-content", children: [_jsx("h3", { children: notification.type }), _jsx("p", { children: notification.content }), _jsxs("div", { className: "meta", children: [_jsx("span", { className: "timestamp", children: new Date(notification.timestamp).toLocaleString() }), _jsx("span", { className: "channel", children: notification.channel })] })] }), !notification.read && (_jsx("button", { className: "mark-read", onClick: () => handleMarkAsRead(notification.id), children: "\uC77D\uC74C\uC73C\uB85C \uD45C\uC2DC" }))] }, notification.id))) }), _jsxs("div", { className: "pagination", children: [_jsx("button", { disabled: page === 1, onClick: () => setPage(page - 1), children: "\uC774\uC804" }), _jsxs("span", { children: ["\uD398\uC774\uC9C0 ", page] }), _jsx("button", { disabled: notifications.length < limit, onClick: () => setPage(page + 1), children: "\uB2E4\uC74C" })] }), _jsx("style", { jsx: true, children: `
        .notification-history {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .filters {
          display: flex;
          gap: 10px;
        }

        .filters button {
          padding: 5px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
        }

        .filters button.active {
          background: #0070f3;
          color: white;
          border-color: #0070f3;
        }

        .notifications-list {
          margin-bottom: 20px;
        }

        .notification-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .notification-item.unread {
          background: #f8f9fa;
        }

        .notification-content {
          flex: 1;
        }

        .notification-content h3 {
          margin: 0 0 5px 0;
          font-size: 1.1em;
        }

        .meta {
          display: flex;
          gap: 10px;
          margin-top: 5px;
          font-size: 0.9em;
          color: #666;
        }

        .mark-read {
          padding: 5px 10px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }

        .pagination button {
          padding: 5px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
        }

        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error {
          color: red;
          padding: 10px;
          border: 1px solid red;
          border-radius: 4px;
        }
      ` })] }));
};
