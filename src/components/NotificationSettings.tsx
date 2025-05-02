import React, { useState, useEffect } from 'react';
import { NotificationService } from '../services/NotificationService';
import { NotificationPreference } from '../types/notification';
import { DEFAULT_TEMPLATES } from '../types/notification';

export const NotificationSettings: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreference>({
    userId: 'current-user-id',
    email: true,
    websocket: true,
    push: false,
    types: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const notificationService = NotificationService.getInstance();
      const savedPreferences = await notificationService.getPreferences('current-user-id');
      if (savedPreferences) {
        setPreferences(savedPreferences);
      }
      setLoading(false);
    } catch (err) {
      setError('설정을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const handlePreferenceChange = async (key: keyof NotificationPreference, value: boolean) => {
    try {
      const updatedPreferences = { ...preferences, [key]: value };
      setPreferences(updatedPreferences);

      const notificationService = NotificationService.getInstance();
      await notificationService.savePreferences('current-user-id', updatedPreferences);
    } catch (err) {
      setError('설정을 저장하는데 실패했습니다.');
    }
  };

  const handleTypeToggle = async (type: string, enabled: boolean) => {
    try {
      const updatedTypes = enabled
        ? [...preferences.types, type]
        : preferences.types.filter(t => t !== type);

      const updatedPreferences = { ...preferences, types: updatedTypes };
      setPreferences(updatedPreferences);

      const notificationService = NotificationService.getInstance();
      await notificationService.savePreferences('current-user-id', updatedPreferences);
    } catch (err) {
      setError('설정을 저장하는데 실패했습니다.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="notification-settings">
      <h2>알림 설정</h2>
      
      <div className="channel-settings">
        <h3>알림 채널</h3>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={preferences.email}
              onChange={(e) => handlePreferenceChange('email', e.target.checked)}
            />
            이메일 알림
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={preferences.websocket}
              onChange={(e) => handlePreferenceChange('websocket', e.target.checked)}
            />
            웹소켓 알림
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={preferences.push}
              onChange={(e) => handlePreferenceChange('push', e.target.checked)}
            />
            푸시 알림
          </label>
        </div>
      </div>

      <div className="type-settings">
        <h3>알림 유형</h3>
        {DEFAULT_TEMPLATES.map(template => (
          <div key={template.id} className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={preferences.types.includes(template.id)}
                onChange={(e) => handleTypeToggle(template.id, e.target.checked)}
              />
              {template.subject}
            </label>
            <p className="description">{template.message}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .notification-settings {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .channel-settings,
        .type-settings {
          margin-bottom: 30px;
        }

        .setting-item {
          margin-bottom: 15px;
          padding: 10px;
          border: 1px solid #eee;
          border-radius: 4px;
        }

        .description {
          margin: 5px 0 0 25px;
          color: #666;
          font-size: 0.9em;
        }

        .error {
          color: red;
          padding: 10px;
          border: 1px solid red;
          border-radius: 4px;
        }

        h2 {
          margin-bottom: 30px;
        }

        h3 {
          margin-bottom: 15px;
        }

        label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        input[type="checkbox"] {
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
}; 