import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { NotificationService } from '../services/NotificationService';
import { DEFAULT_TEMPLATES } from '../types/notification';
export const NotificationSettings = () => {
    const [preferences, setPreferences] = useState({
        userId: 'current-user-id',
        email: true,
        websocket: true,
        push: false,
        types: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
        }
        catch (err) {
            setError('설정을 불러오는데 실패했습니다.');
            setLoading(false);
        }
    };
    const handlePreferenceChange = async (key, value) => {
        try {
            const updatedPreferences = { ...preferences, [key]: value };
            setPreferences(updatedPreferences);
            const notificationService = NotificationService.getInstance();
            await notificationService.savePreferences('current-user-id', updatedPreferences);
        }
        catch (err) {
            setError('설정을 저장하는데 실패했습니다.');
        }
    };
    const handleTypeToggle = async (type, enabled) => {
        try {
            const updatedTypes = enabled
                ? [...preferences.types, type]
                : preferences.types.filter(t => t !== type);
            const updatedPreferences = { ...preferences, types: updatedTypes };
            setPreferences(updatedPreferences);
            const notificationService = NotificationService.getInstance();
            await notificationService.savePreferences('current-user-id', updatedPreferences);
        }
        catch (err) {
            setError('설정을 저장하는데 실패했습니다.');
        }
    };
    if (loading) {
        return _jsx("div", { children: "Loading..." });
    }
    if (error) {
        return _jsx("div", { className: "error", children: error });
    }
    return (_jsxs("div", { className: "notification-settings", children: [_jsx("h2", { children: "\uC54C\uB9BC \uC124\uC815" }), _jsxs("div", { className: "channel-settings", children: [_jsx("h3", { children: "\uC54C\uB9BC \uCC44\uB110" }), _jsx("div", { className: "setting-item", children: _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: preferences.email, onChange: (e) => handlePreferenceChange('email', e.target.checked) }), "\uC774\uBA54\uC77C \uC54C\uB9BC"] }) }), _jsx("div", { className: "setting-item", children: _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: preferences.websocket, onChange: (e) => handlePreferenceChange('websocket', e.target.checked) }), "\uC6F9\uC18C\uCF13 \uC54C\uB9BC"] }) }), _jsx("div", { className: "setting-item", children: _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: preferences.push, onChange: (e) => handlePreferenceChange('push', e.target.checked) }), "\uD478\uC2DC \uC54C\uB9BC"] }) })] }), _jsxs("div", { className: "type-settings", children: [_jsx("h3", { children: "\uC54C\uB9BC \uC720\uD615" }), DEFAULT_TEMPLATES.map(template => (_jsxs("div", { className: "setting-item", children: [_jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: preferences.types.includes(template.id), onChange: (e) => handleTypeToggle(template.id, e.target.checked) }), template.subject] }), _jsx("p", { className: "description", children: template.message })] }, template.id)))] }), _jsx("style", { jsx: true, children: `
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
      ` })] }));
};
