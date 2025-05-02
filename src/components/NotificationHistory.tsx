import React, { useState, useEffect } from 'react';
import { NotificationLogger } from '../services/NotificationLogger';
import { NotificationHistory } from '../types/notification';

export const NotificationHistory: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread'>('all');

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
      } else {
        setNotifications(history);
      }
      
      setLoading(false);
    } catch (err) {
      setError('알림 내역을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const logger = NotificationLogger.getInstance();
      const count = await logger.getUnreadCount('current-user-id');
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const logger = NotificationLogger.getInstance();
      await logger.markAsRead(notificationId);
      await loadNotifications();
      await loadUnreadCount();
    } catch (err) {
      setError('알림을 읽음으로 표시하는데 실패했습니다.');
    }
  };

  const handleFilterChange = (filter: 'all' | 'unread') => {
    setSelectedFilter(filter);
    setPage(1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="notification-history">
      <div className="header">
        <h2>알림 내역</h2>
        <div className="filters">
          <button
            className={selectedFilter === 'all' ? 'active' : ''}
            onClick={() => handleFilterChange('all')}
          >
            전체 ({notifications.length})
          </button>
          <button
            className={selectedFilter === 'unread' ? 'active' : ''}
            onClick={() => handleFilterChange('unread')}
          >
            읽지 않음 ({unreadCount})
          </button>
        </div>
      </div>

      <div className="notifications-list">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
          >
            <div className="notification-content">
              <h3>{notification.type}</h3>
              <p>{notification.content}</p>
              <div className="meta">
                <span className="timestamp">
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
                <span className="channel">{notification.channel}</span>
              </div>
            </div>
            {!notification.read && (
              <button
                className="mark-read"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                읽음으로 표시
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          이전
        </button>
        <span>페이지 {page}</span>
        <button
          disabled={notifications.length < limit}
          onClick={() => setPage(page + 1)}
        >
          다음
        </button>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
};
